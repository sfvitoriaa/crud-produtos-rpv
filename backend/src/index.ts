import express, { Response } from 'express'
import cors from 'cors'
import { login } from './controllers/authController'
import { AuthRequest, verifyJWT } from './middleware/authMiddleware'
import z from 'zod'
import { validate } from './services/validate'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './controllers/productController'

const app = express()
const PORT = 5000

// Middlewares
app.use(express.json())

const corsOptions = {
    origin: "*",
}
app.use(cors(corsOptions))

const schemaLogin = z.object({
    email: z.string().email('E-mail inválido.'),
    password: z.string().min(8, 'Mínimo 8 caracteres.')
})

export type TLogin = z.infer<typeof schemaLogin>

app.get('/', (req, res) => {
    res.status(200).json({ message: "Servidor rodando!" })
})

app.post('/login', validate(schemaLogin), login)

app.get('/perfil', verifyJWT, (req: AuthRequest, res: Response) => {
    res.status(200).json({ message: `Seja bem vindo! Seu id é ${req.userId}` })
})

app.get('/users', (req, res) => {
    res.status(200).json({
        data: {
            infos: {
                users: [
                    { name: "Daniel", age: 35 },
                    { name: "Joel", age: 45 }
                ]
            }
        }
    })
})

// Rotas de Produtos (CRUD)
app.get('/produtos', getProducts)
app.get('/produtos/:id', getProductById)
app.post('/produtos', createProduct)
app.put('/produtos/:id', updateProduct)
app.delete('/produtos/:id', deleteProduct)


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})