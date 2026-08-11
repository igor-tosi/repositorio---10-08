const SENHA = "123456"

const middlewareDeAutenticacao = (req, res, next) => {
    const senhaEnviada = req.headers.senha;

    if (senhaEnviada !== SENHA) {
        return res.status(401).send({ message: "Acesso negado"});
    }

    next();
}

module.exports = {
    middlewareDeAutenticacao
}