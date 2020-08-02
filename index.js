const PORT = process.env.PORT || 8000;
var express = require("express")
var path = require("path")

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get("/", (req, res) => {
        
        res.render("pages/index")
      
    })
    .get("/Memorias", (req, res) => {
        
        res.render("pages/Memorias/Memorias")
      
    })
    .get("/MapaDeKarnaugh", (req, res) => {
        
        res.render("pages/MapaDeKarnaugh/MapaDeKarnaugh")
      
    })
    .get("/Registradores", (req, res) => {
        
        res.render("pages/Registradores/Registradores")
      
    })
    .get("/MaquinaDeEstados", (req, res) => {
        
        res.render("pages/MaquinaDeEstados/Maquina")
      
    })
    
    
    .listen(PORT, () => {console.log(`Conectado ao port ${ PORT }`)})