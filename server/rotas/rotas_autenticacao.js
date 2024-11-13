import Express from "express";
import { login, registro } from "../controlador/controlador_autenticacao.js";

const rotas_autenticacao = Express.Router()

rotas_autenticacao.post('/registro', registro)
rotas_autenticacao.post('/login', login)

export { rotas_autenticacao }