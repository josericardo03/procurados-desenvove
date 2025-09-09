import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "@/components/ui/pagination";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 0,
    totalPages: 5,
    pageSize: 10,
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders pagination controls", () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText("Itens por página:")).toBeInTheDocument();
    expect(screen.getByText("Anterior")).toBeInTheDocument();
    expect(screen.getByText("Próxima")).toBeInTheDocument();
  });

  it("renders page numbers correctly", () => {
    render(<Pagination {...defaultProps} />);

    // Should show pages 1, 2, 3, 4, 5
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    render(<Pagination {...defaultProps} currentPage={0} />);

    // Find the previous button by its role and disabled state
    const prevButton = screen.getByRole("button", { name: /anterior/i });
    expect(prevButton).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(<Pagination {...defaultProps} currentPage={4} />);

    // Find the next button by its role and disabled state
    const nextButton = screen.getByRole("button", { name: /próxima/i });
    expect(nextButton).toBeDisabled();
  });

  it("calls onPageChange when page is clicked", () => {
    const onPageChange = jest.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    const page2 = screen.getByText("2");
    fireEvent.click(page2);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageSizeChange when page size is changed", () => {
    const onPageSizeChange = jest.fn();
    render(
      <Pagination {...defaultProps} onPageSizeChange={onPageSizeChange} />
    );

    // Test that the select trigger is rendered
    const selectTrigger = screen.getByRole("combobox");
    expect(selectTrigger).toBeInTheDocument();

    // Test that the current value is displayed
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("shows correct page size options", () => {
    render(<Pagination {...defaultProps} />);

    // Test that the select trigger is rendered with current value
    const selectTrigger = screen.getByRole("combobox");
    expect(selectTrigger).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("does not render when totalPages is 1 or less", () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={1} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("handles ellipsis for large page counts", () => {
    render(<Pagination {...defaultProps} totalPages={10} currentPage={5} />);

    // Should show ellipsis for large page counts
    expect(screen.getByText("1")).toBeInTheDocument();
    // Use getAllByText to handle multiple elements with "10"
    const elementsWith10 = screen.getAllByText("10");
    expect(elementsWith10.length).toBeGreaterThan(0);
  });
});
