import { api } from "@/api/axiosInstance";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  
  const [busca, setBusca] = useState("");

  useEffect(() => {
    api.get("/produtos")
      .then((response) => {
        setProdutos(response.data.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
      });
  }, []);

  const deletarProduto = (id: any) => {
    if (confirm("Tem certeza que deseja excluir?")) {
      api.delete(`/produtos/${id}`)
        .then(() => {
          const listaAtualizada = produtos.filter((p: any) => p.id !== id);
          setProdutos(listaAtualizada);
        })
        .catch((error) => {
          console.error("Erro ao excluir:", error);
        });
    }
  };


  const produtosFiltrados = produtos.filter((produto: any) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-4 bg-white min-h-screen text-black">
      

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Produtos</h1>
        <Link href="/produtos/novo" className="border border-black px-2 py-1 text-sm font-medium">
          + Novo Produto
        </Link>
      </div>

    
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar produto"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full max-w-md border border-black p-2 text-sm bg-white text-black"
        />
      </div>

    
      <table className="w-full text-left">
        <thead className="border-b-2 border-black text-sm">
          <tr>
            <th className="pb-2">Nome</th>
            <th className="pb-2">Preço</th>
            <th className="pb-2">Quantidade</th>
            <th className="pb-2 text-right">Ações</th>
          </tr>
        </thead>
        
        <tbody className="text-sm">
          {produtosFiltrados.map((produto) => (
            <tr key={produto.id} className="border-b border-gray-300">
              <td className="py-3 font-medium">{produto.nome}</td>
              <td className="py-3">R$ {Number(produto.preco).toFixed(2)}</td>
              <td className="py-3">{produto.quantidade}</td>
              <td className="py-3 text-right space-x-3">
                <Link href={`/produtos/${produto.id}`} className="underline">
                  Editar
                </Link>
                <button
                  type="button"
                  className="underline text-red-600"
                  onClick={() => deletarProduto(produto.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}