//definicion de clases
class Libro{
    constructor(titulo, autor, isbn){
        this.titulo= titulo;
        this.autor= autor;
        this.isbn= isbn;
    }
}
class UI{
    static mostrarLibros(){
       // localStorage.clear();
        const libros = Datos.getLibros();
        libros.forEach( (libro) => UI.agregarLibroLista(libro));
    
    }

    static agregarLibroLista(libro){
        const lista = document.querySelector('#libro-list');
        const fila = document.createElement('tr');
        const libros= Datos.getLibros();
      
        fila.innerHTML = `
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        lista.appendChild(fila);
        console.log('agregar');
        
    }

    static eliminarLibro(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
    static mostrarAlerta(mensaje,className){
        const div=document.createElement('div');
        div.className= `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensaje));

        const container= document.querySelector('.container');
        const form = document.querySelector('#libro-form');
        container.insertBefore(div,form);

        setTimeout(()=>document.querySelector('.alert').remove(),3000);
    }
    static limpiarCampos(){
        document.querySelector('#titulo').value='';
        document.querySelector('#autor').value='';
        document.querySelector('#isbn').value='';
    }
    static libroExist(isbn){
        const libros= Datos.getLibros();
        let band=true;
        libros.forEach((libro)=>{
            console.log('existe');
            if(libro.isbn===isbn){ 
                band=false;
                return band;
            }
        });
        return band;
    }
    static consultarLibro(tag, campo){
        
    }
}

class Datos{
    static getLibros(){
        let libros;
        if(localStorage.getItem('libros')===null){
            libros=[];
        }else{
            libros = JSON.parse(localStorage.getItem('libros'));
        }
        return libros;
    }

    static addLibro(Libro){
        const libros= Datos.getLibros();
        libros.push(Libro);
        localStorage.setItem('libros',JSON.stringify(libros));
        UI.mostrarAlerta('Libro agregado correctamente :D','success');
    }

    static removeLibro(isbn){
        const libros = Datos.getLibros();
        libros.forEach((libro,index)=>{
            if(libro.isbn === isbn){
                libros.splice(index,1);
            }
        });
        localStorage.setItem('libros', JSON.stringify(libros));
        UI.mostrarAlerta('Libro Eliminado','success');
    }
}

//js
// carga de la pagina
document.addEventListener('DOMContentLoaded',UI.mostrarLibros());
//click enviar
document.querySelector('#consultar').addEventListener('click',(e)=>{
    e.preventDefault();

    const campo= document.querySelector('#busqueda').value;
    const tag=document.querySelector('#tag').value;
    console.log(tag);
    UI.consultarLibro(tag,campo);
});
//click al boton
document.querySelector('#libro-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    //obetner valores de los campos
    const titulo=document.querySelector('#titulo').value;
    const autor=document.querySelector('#autor').value;
    const isbn=document.querySelector('#isbn').value;

    if(titulo === ''|| autor===''|| isbn===''){
        UI.mostrarAlerta('Por favor rellene todos los campos','danger');
    }else if(UI.libroExist(isbn)===false){
        UI.mostrarAlerta('El codigo isbn ya existe, ingrese uno valido','warning');
        UI.limpiarCampos();
    }else{
        const libro= new Libro(titulo,autor,isbn);
        Datos.addLibro(libro);
        UI.agregarLibroLista(libro);
        UI.limpiarCampos();
    }
});

document.querySelector('#libro-list').addEventListener('click', (e)=>{
    UI.eliminarLibro(e.target);
    Datos.removeLibro(e.target.parentElement.previousElementSibling.textContent);
});