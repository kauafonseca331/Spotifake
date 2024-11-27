import Express from 'express';
import { User, criarTabelas } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = Express();
app.use(Express.json());
app.use(cors());

//criarTabelas()

app.post('/registro', async function (req, res) {
    try {
        const { nome, sobrenome, email, senha, dataNascimento } = req.body;
        if (!nome || !sobrenome || !email || !senha || !dataNascimento) {
            res.status(406).send('todos os campos devem ser preenchidos');
            return;
        }
        if (await User.findOne({ where: { email: email } })) {
            res.status(400).send('usuario ja cadastrado');
            return;
        }
        const senhaSegura = bcrypt.hashSync(senha, 10);

        const novoUsuario = await User.create({
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            senha: senhaSegura,
            dataNascimento: dataNascimento,
        });
        res.status(201).send('ok usuario criado');
    } catch (erro) {
        console.log(erro);
    }
});

app.post('/login', async function (req, res) {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            res.send('todos os campos devem ser preenchidos');
            return;
        }
        const usuario = await User.findOne({ where: { email: email } });
        if (!usuario) {
            res.send('Este email não esta cadastrado');
            return;
        }

        const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaCorreta) {
            res.send('A senha esta incorreta');
            return;
        }

        const token = jwt.sign(
            {
                nome: usuario.nome,
                email: usuario.email,
                status: usuario.status,
            },
            'chavecriptografiasupersegura',
            { expiresIn: '30d' }
        );

        res.send({ msg: 'voce foi logado', token });
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Houve um problema');
    }
});

app.post('/alterar-senha', async function (req, res) {
    try {
        const { token, senhaAntiga, novaSenha } = req.body;

        if (!token || !senhaAntiga || !novaSenha) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        const decoded = jwt.verify(token, 'chavecriptografiasupersegura');
        const usuario = await User.findOne({ where: { email: decoded.email } });

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado');
        }

        const senhaCorreta = bcrypt.compareSync(senhaAntiga, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).send('Senha antiga incorreta');
        }

        if (novaSenha.length < 6) {
            return res.status(400).send('A nova senha deve ter pelo menos 6 caracteres');
        }

        const senhaHash = bcrypt.hashSync(novaSenha, 10);

        usuario.senha = senhaHash;
        await usuario.save();

        res.send('Senha alterada com sucesso');
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Houve um problema ao alterar a senha');
    }
});

app.put('/nova_senha/:email', async function(req,res)  {
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

        const senhaSegura = bcrypt.hashSync(senha, 10)
        await usuario.update({ senha: senhaSegura });
        res.status(200).send('senha alterada com sucesso')
    } catch(error) {
        console.log(error)
        res.status(500).send('erro no servidor')
    }
}
)

app.post('/salvar_foto/:email', async function (req, res)  {
    const { foto } = req.body
    const { email } = req.params
    try {
        if (!foto) {
            res.status(400).send('o campo deve ser preenchido')
            return
        }
        const usuario = await User.findOne({ where: { email: email } })

        if (!usuario) {
            res.status(404).send('usuario não encontrado', email)
            return
        }
        await usuario.update({ foto_perfil : foto });
        res.status(200).send('foto salva')
    } catch(error) {
        console.log(error)
        res.status(500).send('erro no servidor')
    }
})

app.get('/pegar_usuario/:email', async function (req, res) {
    const { email } = req.params
    const usuario = await User.findOne({ where: { email: email } })
    if(!usuario) {
        res.status(403).send('usuario não encontrado')
        return
    }
    res.status(200).send(usuario)
}
)

app.listen(8000);
