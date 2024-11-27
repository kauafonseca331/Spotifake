import { User } from "../db.js"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


const registro = async (req, res) => {
    // verificar se todos os campos foram enviados
    try {
        const { nome, sobrenome, email, senha, dataNascimento } = req.body
        if (!nome || !sobrenome || !email || !senha || !dataNascimento) {
            res.status(406).send('todos os campos devem ser preenchidos')
            return
        }

        if (await User.findOne({ where: { email: email } })) {
            res.status(400).send('usuario ja existente no sistema')
            return
        }

        const senhaSegura = bcryptjs.hashSync(senha, 10)
        const novoUsuario = User.create({
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            senha: senhaSegura,
            dataNascimento: dataNascimento,
        })
        res.status(200).send('ok, usuario criado')
    } catch (erro) {
        console.log(erro)
    }
}

const login = async (req, res) => {
    // validar informações
    
        try {
            const { email, senha } = req.body
            if (!email || !senha) {
                res.status(406).send('todos os campos devem ser preenchidos')
                return
            }
    // verificar a existencia do usuario
    
            const usuario = await User.findOne({ where: { email: email } })
            if (!usuario) {
                res.status(404).send('este usuario não está cadastrado')
                return
            }
    
    // compara a senha enviada com a senha do banco de dados
    
            const senhaCorreta = bcryptjs.compareSync(senha, usuario.senha)
            if(!senhaCorreta) {
                res.status(403).send('senha incorreta')
                return
            }
    // criar eum token de autenticação
            const token = jwt.sign(
                {
                    nome:usuario.nome,
                    email: usuario.email,
                    status: usuario.status
                },
                'chavecriptografiasupersegura',
                {
                    expiresIn: "30d"
                }
            )
    
            console.log(token) 
    
            // devolver a resposta com o token  
    
            res.status(200).send({msg: 'voce foi logado', token: token})
            
    } catch (erro) {
            console.log(erro)
            res.status(500).send('houve um problema')
        }
    }
    const nova_senha = async(req,res) => {
        const { senha } = req.body
        const { email } = req.params
        try {
            if (!senha) {
                res.status(400).send('o campo deve ser preenchido')
                return
            }
    
            const usuario = await User.findOne({ where: { email: email } })
    
            if (!usuario) {
                res.status(404).send('usuario não encontrado')
                return
            }
    
            const senhaSegura = bcryptjs.hashSync(senha, 10)
            await usuario.update({ senha: senhaSegura });
            res.status(200).send('senha alterada com sucesso')
        } catch(error) {
            console.log(error)
            res.status(500).send('erro no servidor')
        }
    }

export { registro, login, nova_senha }