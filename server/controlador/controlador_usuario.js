import { User } from "../db.js"

const pegar_usuario = async (req, res) => {
    const id_requisicao = req.params.id
    console.log('o id enviado foi ', id_requisicao)
    const usuario = await User.findByPk(id_requisicao)
    if(!usuario) {
        res.status(402).send('id não encontrado')
        return
    }
    res.send(usuario)
}

export { pegar_usuario }