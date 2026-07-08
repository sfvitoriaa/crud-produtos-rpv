import { api } from "@/api/axiosInstance";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditarProduto() {
  const router = useRouter();
  const { id } = router.query;


  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");


  useEffect(() => {
    if (!id) return;

    api.get(`/produtos/${id}`)
      .then((response) => {
        const produto = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        setNome(produto.nome);
        setDescricao(produto.descricao || "");
        setPreco(String(produto.preco));
        setQuantidade(String(produto.quantidade));
      })
      .catch((error) => {
        console.error("Erro ao buscar produto:", error);
      });
  }, [id]);


  const handleSubmit = (e: any) => {
    e.preventDefault();

    api.put(`/produtos/${id}`, {
      nome: nome,
      descricao: descricao,
      preco: Number(preco),
      quantidade: Number(quantidade),
    })
    .then(() => {
     
      router.push("/produtos");
    })
    .catch((error) => {
      console.error("Erro ao atualizar produto:", error);
    });
  };

  return (
   
    <div className="p-4 bg-white min-h-screen text-black">
      <h1 className="text-xl font-bold mb-6">Editar Produto</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1 font-medium text-sm">Nome *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border border-black p-2 text-sm bg-white text-black"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border border-black p-2 text-sm bg-white text-black h-24"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Preço *</label>
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            className="w-full border border-black p-2 text-sm bg-white text-black"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Quantidade</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full border border-black p-2 text-sm bg-white text-black"
          />
        </div>
        <button type="submit" className="border border-black px-4 py-2 text-sm font-medium hover:bg-gray-100">
          Atualizar
        </button>
      </form>
    </div>
  );
}