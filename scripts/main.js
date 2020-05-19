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
        categoriaElegida: [],
        puestoElegido: [],
        productosElegidos: [],
        precioPedidoTotal: 0,
        ingresoCliente: 0,
        pedidoActual: null,

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
            axios.get(localStorage.getItem('URL_API') + 'productos',
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => (this.productos = response.data.data))
        },
        obtenerCategorias() {
            axios.get(localStorage.getItem('URL_API') + 'categorias',
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => (this.categorias = response.data.data))
        },
        obtenerPuestos() {
            axios.get(localStorage.getItem('URL_API') + 'puestos',
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => (this.puestos = response.data.data))
        },
        obtenerUsuarioLogeado() {
            axios.get(localStorage.getItem('URL_API') + 'userlogged',
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => (this.usuarios = response.data))
        },
        obtenerProductosPorCategoria(categoria) {
            axios.post(localStorage.getItem('URL_API') + 'findproductobycategoria',
                /* Aqui va el contenido a enviar en el POST */
                { "id": categoria },
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => {
                    this.productos = response.data
                })
                .catch(() => {
                    console.log(response)
                })
        },
        crearPedido() {
            axios.post(localStorage.getItem('URL_API') + 'pedidos',
                /* Aqui va el contenido a enviar en el POST */
                {
                    "usuario": this.usuarios.id,
                    "puesto": this.puestoElegido.id,
                    "ingreso": this.precioPedidoTotal,
                    "fecha_pedido": "2020-05-15"
                },
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => {
                    this.pedidoActual = response.data.data.id
                    console.log(response)
                })
                .catch(() => {
                    console.log(response)
                })
        },
        anyadirProductosAlPedido(producto, cantidad) {
            axios.post(localStorage.getItem('URL_API') + 'productosdepedidos',
                /* Aqui va el contenido a enviar en el POST */
                {
                    "pedido": this.pedidoActual,
                    "producto": producto,
                    "cantidad": cantidad
                },
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => {
                    console.log(response)
                })
                .catch(() => {
                    console.log(response)
                })
        },
        cancelarPedido() {
            axios.delete(localStorage.getItem('URL_API') + 'pedidos/' + this.pedidoActual,
                { headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem("access_token") } })
                .then(response => console.log(response))
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
                this.actualizaDOM();
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
            
            this.productosElegidos = []
            this.puestoElegido = []
            this.ingresoCliente = 0
            if ( this.pedidoActual != null) {
                this.cancelarPedido()
            }
            
            
        },
        creandoPedido() {
            var respuesta = "Ha ocurrido un error, ";
            var correcto = true;

            if (this.puestoElegido == null) {
                respuesta += "No has elegido puesto, "
                correcto = false;

            }

            if (correcto == true) {

                this.crearPedido()


            } else {
                alert(respuesta)
            }
        },

        cobrar() {
            var respuesta = "Ha ocurrido un error, ";
            var correcto = true;

            if (this.ingresoCliente - this.precioPedidoTotal < 0) {
                respuesta += "Ingreso insuficiente, "
                correcto = false;
            }

            if (correcto == true) {
                this.productosElegidos.forEach(producto => {
                    this.anyadirProductosAlPedido(producto.id, producto.cantidad)
                });

                this.productosElegidos = []
                this.puestoElegido = []
                this.ingresoCliente = 0
                this.actualizaDOM()

                

            } else {
                alert(respuesta)
            }




        },

        sumaCliente(cantidad) {
            this.ingresoCliente += cantidad
        },
        escogerPuesto(puesto) {
            this.puestoElegido = puesto
        },




        goToPanelControl() {
            window.location.href = '/pages/dashboard.html'
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