import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { NovaInformacao } from "@/types/api";
import {
  ApiService,
  HttpError,
  TimeoutError,
  NetworkError,
} from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  ArrowLeft,
  Send,
  Upload,
  X,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";

interface FormularioInformacaoProps {
  pessoaId: number;
  pessoaNome: string;
  ocoId: number;
  onBack: () => void;
  onSuccess: () => void;
}

interface InformacaoFormData {
  informacao: string;
  descricao: string; // legenda/descrição do(s) anexo(s)
  data: string; // yyyy-MM-dd
  localizacao?: string;
  telefone?: string;
}

export function FormularioInformacao({
  pessoaId,
  pessoaNome,
  ocoId,
  onBack,
  onSuccess,
}: FormularioInformacaoProps) {
  const [loading, setLoading] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<InformacaoFormData>({
    defaultValues: {
      data: new Date().toISOString().slice(0, 10),
      descricao: "",
      localizacao: "",
      telefone: "",
    },
    mode: "onChange",
  });

  // Máscara para telefone
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
      return !match[2]
        ? match[1]
        : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;
    }
    return value;
  };

  // Validação de telefone
  const validatePhone = (phone: string) => {
    if (!phone) return true; // telefone é opcional
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  // Validação de data
  const validateDate = (date: string) => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 1); // máximo 1 ano atrás

    return selectedDate >= minDate && selectedDate <= today;
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("telefone", formatted);

    // Validar telefone
    if (formatted && !validatePhone(formatted)) {
      setError("telefone", {
        type: "manual",
        message: "Telefone deve ter 10 ou 11 dígitos",
      });
    } else {
      clearErrors("telefone");
    }
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setValue("data", date);

    // Validar data
    if (!validateDate(date)) {
      setError("data", {
        type: "manual",
        message: "Data deve ser entre 1 ano atrás e hoje",
      });
    } else {
      clearErrors("data");
    }
  };

  // Função para obter localização automática
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada neste navegador");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Usar API de geocodificação reversa para obter endereço
        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.city && data.principalSubdivision) {
              const endereco = `${data.city}, ${data.principalSubdivision}`;
              setValue("localizacao", endereco);
              toast.success("Localização obtida com sucesso!");
            } else {
              setValue(
                "localizacao",
                `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              );
              toast.success("Coordenadas obtidas com sucesso!");
            }
          })
          .catch(() => {
            // Fallback para coordenadas se a API falhar
            setValue(
              "localizacao",
              `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            );
            toast.success("Coordenadas obtidas com sucesso!");
          })
          .finally(() => {
            setLocationLoading(false);
          });
      },
      (error) => {
        let message = "Erro ao obter localização";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Permissão de localização negada";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Localização indisponível";
            break;
          case error.TIMEOUT:
            message = "Tempo limite excedido";
            break;
        }
        setLocationError(message);
        setLocationLoading(false);
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos
      }
    );
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB
          toast.error(`A imagem ${file.name} é muito grande. Máximo 5MB.`);
          return false;
        }
        return true;
      } else {
        toast.error(`O arquivo ${file.name} não é uma imagem válida.`);
        return false;
      }
    });

    if (fotos.length + newFiles.length > 5) {
      toast.error("Máximo de 5 fotos permitidas.");
      return;
    }

    setFotos((prev) => [...prev, ...newFiles]);
  };

  const removePhoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const onSubmit = async (data: InformacaoFormData) => {
    try {
      setLoading(true);

      const informacao: NovaInformacao = {
        ocoId,
        informacao: data.informacao,
        descricao: data.descricao || "",
        data: data.data,
        fotos: fotos.length > 0 ? fotos : undefined,
      };

      await ApiService.enviarInformacao(informacao);

      toast.success("Informação enviada com sucesso!", {
        description: "Obrigado por contribuir com as investigações.",
      });

      onSuccess();
    } catch (error) {
      let description =
        "Ocorreu um erro inesperado. Tente novamente em alguns minutos.";
      if (error instanceof TimeoutError)
        description = "API está fora de funcionamento. Volte mais tarde.";
      else if (error instanceof NetworkError)
        description =
          "Problema de conexão. Verifique sua internet e tente novamente.";
      else if (error instanceof HttpError)
        description = `Serviço temporariamente indisponível (Erro ${error.status}). Tente novamente em alguns minutos.`;
      toast.error("Erro ao enviar informação", { description });
    } finally {
      setLoading(false);
    }
  };

  const watchedInfo = watch("informacao", "");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 hover:bg-accent"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar aos detalhes
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MessageSquare className="w-6 h-6" />
            Enviar Informação
          </CardTitle>
          <p className="text-muted-foreground">
            Sobre:{" "}
            <span className="font-semibold text-foreground">{pessoaNome}</span>
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Forneça apenas informações
              verdadeiras e relevantes. Informações falsas podem prejudicar as
              investigações e são crime.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Data do avistamento */}
            <div className="space-y-2">
              <Label htmlFor="data" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data do avistamento *
              </Label>
              <Input
                id="data"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                min={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .slice(0, 10)}
                {...register("data", {
                  required: "Data é obrigatória",
                  validate: validateDate,
                })}
                onChange={handleDateChange}
                className={errors.data ? "border-destructive" : ""}
              />
              {errors.data && (
                <span className="text-sm text-destructive">
                  {errors.data.message}
                </span>
              )}
              <p className="text-sm text-muted-foreground">
                Data em que você viu ou teve informações sobre esta pessoa
              </p>
            </div>

            {/* Informação principal */}
            <div className="space-y-2">
              <Label htmlFor="informacao" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Informação *
              </Label>
              <Textarea
                id="informacao"
                placeholder="Descreva detalhadamente as informações que você possui sobre esta pessoa. Inclua local, data, hora e circunstâncias em que você a viu..."
                className="min-h-32 resize-none"
                {...register("informacao", {
                  required: "Este campo é obrigatório",
                  minLength: {
                    value: 10,
                    message: "Informação deve ter pelo menos 10 caracteres",
                  },
                  maxLength: {
                    value: 500,
                    message: "Informação deve ter no máximo 500 caracteres",
                  },
                })}
              />
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {watchedInfo.length}/500 caracteres
                </div>
                {errors.informacao && (
                  <span className="text-sm text-destructive">
                    {errors.informacao.message}
                  </span>
                )}
              </div>
            </div>

            {/* Localização */}
            <div className="space-y-2">
              <Label htmlFor="localizacao" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Local onde a pessoa foi vista (opcional)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="localizacao"
                  placeholder="Ex: Rua das Flores, 123 - Centro - Cuiabá/MT"
                  {...register("localizacao")}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="px-3"
                >
                  {locationLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {locationError && (
                <p className="text-sm text-destructive">{locationError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Seja específico com endereços, pontos de referência ou
                coordenadas. Use o botão de localização para obter sua posição
                atual automaticamente.
              </p>
            </div>

            {/* Telefone para contato */}
            <div className="space-y-2">
              <Label htmlFor="telefone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone para contato (opcional)
              </Label>
              <Input
                id="telefone"
                placeholder="(65) 99999-9999"
                value={watch("telefone") || ""}
                onChange={handlePhoneChange}
                maxLength={15}
                className={errors.telefone ? "border-destructive" : ""}
              />
              {errors.telefone && (
                <span className="text-sm text-destructive">
                  {errors.telefone.message}
                </span>
              )}
              <p className="text-sm text-muted-foreground">
                Para que a polícia possa entrar em contato se necessário
              </p>
            </div>

            {/* Upload de fotos */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Fotos (opcional) - Máximo 5 fotos
              </Label>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-foreground">
                    Arraste fotos aqui ou{" "}
                    <label className="text-primary cursor-pointer hover:underline">
                      clique para selecionar
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                      />
                    </label>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Formato: JPG, PNG, GIF | Tamanho máximo: 5MB por foto
                  </p>
                </div>
              </div>

              {/* Preview das fotos */}
              {fotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {fotos.map((foto, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(foto)}
                        alt={`Preview ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                        {(foto.size / 1024 / 1024).toFixed(1)}MB
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Descrição dos anexos */}
              <div className="space-y-2">
                <Label htmlFor="descricao">
                  Descrição dos anexos (opcional)
                </Label>
                <Input
                  id="descricao"
                  placeholder="Ex.: Foto do avistamento na Av. Brasil"
                  {...register("descricao")}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || locationLoading}
                className="flex-1 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Informação
                  </>
                )}
              </Button>
            </div>

            {/* Status de processamento */}
            {loading && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Enviando sua informação...
                    </p>
                    <p className="text-xs text-blue-600">
                      Por favor, aguarde enquanto processamos sua contribuição.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Sua informação será analisada pela Polícia Civil e poderá
              contribuir significativamente para as investigações.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
