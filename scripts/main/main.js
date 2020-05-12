var aplicacion = new Vue({
    el: "#app",
    data: {
        categorias: [],
        productos: [],
        productos_de_pedidos: [],
        pedidos: [],
        usuarios: [],
        puestos: [],
        listaPedidos: [],
        categoriaElegida: null,
        puestoElegido: null,
        productosElegidos: [],
        precioPedidoTotal:0
        
    },
    mounted() {

        axios.get('http://tpv.test/api/productos',
            { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
            .then(response => (this.productos = response.data.data))

        axios.get('http://tpv.test/api/categorias',
            { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
            .then(response => (this.categorias = response.data.data))

        axios.get('http://tpv.test/api/puestos',
            { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
            .then(response => (this.puestos = response.data))

        axios.get('http://tpv.test/api/userlogged',
            { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
            .then(response => (this.usuarios = response.data))



    },
    methods: {
        anyadirProducto(producto) {
            if (this.productosElegidos.includes(producto)) {
                var indice = this.productosElegidos.indexOf(producto);
                this.productosElegidos[indice].cantidad++
                this.actualizaDOM();
            } else {
                producto.cantidad = 1;
                this.productosElegidos.push(producto);
            }
            
        },
        borrarProductoPedido(indice) {
            /* Si tiene cantidad >1 se le resta, si no, se elimina de la lista */
            if (this.productosElegidos[indice].cantidad > 1) {
                this.productosElegidos[indice].cantidad--
                this.actualizaDOM();
            } else {
                this.productosElegidos.splice(indice, 1);
            }
        },
        vaciarPedido(){
            console.log("HOLA")
            this.productosElegidos = []
        },
        goToPanelControl(){
            window.location.href = '/pages/dashboard/dashboard.html'
        },

        actualizaDOM() {
            /* Para forzar a actualizar la reactividad a la hora de añadir un producto y actualizar el numero de productos */
            this.productosElegidos.push("d");
            this.productosElegidos.pop();
        },


    },computed: {
        precioTotal() {
            this.precioPedidoTotal = 0
            for (let index = 0; index < this.productosElegidos.length; index++) {      
              this.precioPedidoTotal += (parseFloat(this.productosElegidos[index].precio) * this.productosElegidos[index].cantidad )
            }
            
           return this.precioPedidoTotal
        }
    },


});