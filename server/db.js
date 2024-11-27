import Sequelize from 'sequelize'

const sequelize = new Sequelize(
    'spotfake',
    'postgres',
    'postgres',
    {
        host: 'localhost',
        port: 5432,
        dialect: 'postgres'
    }
)
const User = sequelize.define('user', {
    nome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    sobrenome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    dataNascimento: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'inativo'
    },
    foto_perfil: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'https://res.cloudinary.com/duo8nbu2l/image/upload/v1732039695/bkuozj0eb4iefrsbjoda.jpg'
    },
})

const criarTabelas = () => {
    sequelize.authenticate().then(() => {
        console.log('conectou')
    })
        .catch((err) => {
            console.log(err)
        })
    sequelize.sync({ force: true }).then(() => {
        console.log('tabela criada')
    })
}

export { User, sequelize, criarTabelas };