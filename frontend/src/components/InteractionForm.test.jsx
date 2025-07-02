import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import InteractionForm from './InteractionForm';

describe('InteractionForm', () => {
  it('renders all form fields correctly', () => {
    render(<InteractionForm />);

    // Verificar que los campos con FloatingLabel están presentes
    // Para FloatingLabel, buscamos el texto de la etiqueta
    expect(screen.getByLabelText(/nombre del cliente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de interacción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notas breves/i)).toBeInTheDocument();

    // Verificar el switch
    expect(screen.getByRole('switch', { name: /potencial de recompra/i })).toBeInTheDocument();

    // Verificar el botón de submit
    expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument();
  });
}); 