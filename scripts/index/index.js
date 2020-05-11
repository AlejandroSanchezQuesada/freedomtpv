var aplicacion = new Vue({
    el: "#app",
    data: {
        email: "",
        password: "",
        password_confirmation: "",
        jefe: false,
        name: "",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Microsoft_Account.svg/1200px-Microsoft_Account.svg.png",
        login_registro: true

    },
    methods: {
        /* Metodos HTTP */
        logear() {
        
            axios.post('http://tpv.test/api/login', {
                email: this.email,
                password: this.password
            })
                .then(response => {
                    console.log(response)
                    if (response.data.access_token) {
                        localStorage.setItem("access_token", response.data.access_token);
                    }
                    window.location.href = 'blog'
                })
                .catch(error => {
                    console.log(error.response)

                });
        },
        registrarse() {
          
            axios.post('http://tpv.test/api/registrarse', {
                name:this.name,
                email: this.email,
                password: this.password,
                password_confirmation: this.password_confirmation,
                jefe:this.jefe,
                avatar:this.avatar
            })
                .then(response => {
                    console.log("registrado!")
                    window.location.href = 'blog'
                    /* if (response.data.access_token) {
                        localStorage.setItem("access_token", response.data.access_token);
                    } */
                })
                .catch(error => {
                    console.log(error.response)

                });
        },
        /* Metodos Funcionalidad */
        crearCuenta() {
            this.login_registro = false
        },
        volverLogin() {
            this.login_registro = true
        },




    },


});