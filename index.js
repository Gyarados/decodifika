const PORT = process.env.PORT || 8000;
var express = require("express")
var path = require("path")



express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get("/", (req, res) => {
        
        res.render("pages/index", {css: 'css/estilosMain.css'})
      
    })
    .get("/Memorias", (req, res) => {
        
        res.render("pages/Memorias/Memorias", {css: 'css/estilosMem2.css'})
      
    })
    .get("/MapaDeKarnaugh", (req, res) => {
        
        res.render("pages/MapaDeKarnaugh/MapaDeKarnaugh", {css: 'css/estilosMap.css'})
      
    })
    .get("/Registradores", (req, res) => {
        
        res.render("pages/Registradores/Registradores", {css: 'css/estilosReg.css'})
      
    })
    .get("/MaquinaDeEstados", (req, res) => {
        
        res.render("pages/MaquinaDeEstados/Maquina", {css: 'css/estilosMaq2.css'})
      
    })
    
    
    .listen(PORT, () => {console.log(`Conectado ao port ${ PORT }`)})