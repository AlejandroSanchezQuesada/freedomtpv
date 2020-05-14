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
        precioPedidoTotal: 0,
        ingresoCliente:0

    },
   async mounted() {

        this.obtenerProductos()
        this.obtenerCategorias()
        this.obtenerPuestos()
        this.obtenerUsuarioLogeado()

    },
    methods: {
        /* Metodos HTTP */
        obtenerProductos() {
            axios.get(localStorage.getItem('URL_API')+'productos',
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => (this.productos = response.data.data))
        },
        obtenerCategorias() {
            axios.get(localStorage.getItem('URL_API')+'categorias',
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => (this.categorias = response.data.data))
        },
        obtenerPuestos() {
            axios.get(localStorage.getItem('URL_API')+'puestos',
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => (this.puestos = response.data))
        },
        obtenerUsuarioLogeado() {
            axios.get(localStorage.getItem('URL_API')+'userlogged',
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => (this.usuarios = response.data))
        },
        obtenerProductosPorCategoria(categoria) {
            axios.post(localStorage.getItem('URL_API')+'findproductobycategoria',
                { "id": categoria },
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => {
                    this.productos = response.data
                })
                .catch(() => {
                    console.log(response)
                })
        },

/* Metodos para dar funcionalidad */

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
        vaciarPedido() {
            console.log("HOLA")
            this.productosElegidos = []
        },
        cobrar(){
            alert("lets go money printer go brrr!")
        },
        sumaCliente(cantidad){
            this.ingresoCliente+=cantidad
        },




        goToPanelControl() {
            window.location.href = '/pages/dashboard/dashboard.html'
        },

        actualizaDOM() {
            /* Para forzar a actualizar la reactividad a la hora de añadir un producto y actualizar el numero de productos */
            this.productosElegidos.push("d");
            this.productosElegidos.pop();
        },


    }, computed: {
        precioTotal() {
            this.precioPedidoTotal = 0
            for (let index = 0; index < this.productosElegidos.length; index++) {
                this.precioPedidoTotal += (parseFloat(this.productosElegidos[index].precio) * this.productosElegidos[index].cantidad)
            }

            return this.precioPedidoTotal
        }
    },


});