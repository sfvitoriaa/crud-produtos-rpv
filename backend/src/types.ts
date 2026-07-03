export interface IProduto {
    id: number;
    nome: string;
    descricao: string | null;
    preco: number;
    quantidade: number;
    criado_em?: Date;
}