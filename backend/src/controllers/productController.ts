import { Request, Response } from 'express'
import { db } from '../database/connection'

// GET /produtos
export const getProducts = async (req: Request, res: Response) => {
    try {
        const q = String(req.query.q || '').trim()

        let query = db('produtos').select('*').orderBy('id', 'desc')

        if (q.length) {
            query = query.whereILike('nome', `%${q}%`)
        }

        const products = await query

        return res.status(200).json({ data: products })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro ao buscar produtos.' })
    }
}

// GET /produtos/:id 
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const product = await db('produtos').where({ id: Number(id) }).first()

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' })
        }

        return res.status(200).json({ data: product })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro ao buscar produto.' })
    }
}

// POST /produtos 
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { nome, descricao, preco, quantidade } = req.body

        if (!nome || preco === undefined) {
            return res.status(400).json({ message: 'Nome e preco são obrigatórios.' })
        }

        const insertPayload: any = {
            nome,
            descricao: descricao || null,
            preco: Number(preco) || 0,
            quantidade: Number(quantidade) || 0
        }

        const [id] = await db('produtos').insert(insertPayload)

        const product = await db('produtos').where({ id }).first()

        return res.status(201).json({ data: product })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro ao criar produto.' })
    }
}

// PUT /produtos/:id 
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { nome, descricao, preco, quantidade } = req.body

        const payload: any = {}
        if (nome !== undefined) payload.nome = nome
        if (descricao !== undefined) payload.descricao = descricao
        if (preco !== undefined) payload.preco = Number(preco)
        if (quantidade !== undefined) payload.quantidade = Number(quantidade)

       
        if (Object.keys(payload).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado válido para atualização foi fornecido.' })
        }

        const updated = await db('produtos').where({ id: Number(id) }).update(payload)

        if (!updated) {
            return res.status(404).json({ message: 'Produto não encontrado.' })
        }

        const product = await db('produtos').where({ id: Number(id) }).first()

        return res.status(200).json({ data: product })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro ao atualizar produto.' })
    }
}

// DELETE /produtos/:id 
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const deleted = await db('produtos').where({ id: Number(id) }).del()

        if (!deleted) {
            return res.status(404).json({ message: 'Produto não encontrado.' })
        }

        return res.status(200).json({ message: 'Produto removido com sucesso.' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro ao remover produto.' })
    }
}