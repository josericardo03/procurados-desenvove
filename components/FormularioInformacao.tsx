import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NovaInformacao } from '../types/api';
import { ApiService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Send, 
  Upload, 
  X, 
  MapPin, 
  Phone, 
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FormularioInformacaoProps {
  pessoaId: number;
  pessoaNome: string;
  onBack: () => void;
  onSuccess: () => void;
}

interface FormData {
  informacao: string;
  localizacao: string;
  telefone: string;
}

export function FormularioInformacao({ 
  pessoaId, 
  pessoaNome, 
  onBack, 
  onSuccess 
}: FormularioInformacaoProps) {
  const [loading, setLoading] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<FormData>();

  // Máscara para telefone
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
      return !match[2] 
        ? match[1] 
        : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue('telefone', formatted);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
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
      toast.error('Máximo de 5 fotos permitidas.');
      return;
    }

    setFotos(prev => [...prev, ...newFiles]);
  };

  const removePhoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
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

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const informacao: NovaInformacao = {
        pessoaId,
        informacao: data.informacao,
        localizacao: data.localizacao || undefined,
        telefone: data.telefone || undefined,
        fotos: fotos.length > 0 ? fotos : undefined
      };

      await ApiService.enviarInformacao(informacao);
      
      toast.success('Informação enviada com sucesso!', {
        description: 'Obrigado por contribuir com as investigações.'
      });
      
      onSuccess();
    } catch (error) {
      toast.error('Erro ao enviar informação', {
        description: 'Tente novamente em alguns minutos.'
      });
    } finally {
      setLoading(false);
    }
  };

  const watchedInfo = watch('informacao', '');

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
            Sobre: <span className="font-semibold text-foreground">{pessoaNome}</span>
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Forneça apenas informações verdadeiras e relevantes. 
              Informações falsas podem prejudicar as investigações e são crime.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register('informacao', {
                  required: 'Este campo é obrigatório',
                  minLength: {
                    value: 20,
                    message: 'A informação deve ter pelo menos 20 caracteres'
                  }
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
              <Input
                id="localizacao"
                placeholder="Ex: Rua das Flores, 123 - Centro - Cuiabá/MT"
                {...register('localizacao')}
              />
              <p className="text-sm text-muted-foreground">
                Seja específico com endereços, pontos de referência ou coordenadas
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
                value={watch('telefone') || ''}
                onChange={handlePhoneChange}
                maxLength={15}
              />
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
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-foreground">
                    Arraste fotos aqui ou{' '}
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
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center gap-2"
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
          </form>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Sua informação será analisada pela Polícia Civil e poderá contribuir 
              significativamente para as investigações.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}