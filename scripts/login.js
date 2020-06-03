var aplicacion = new Vue({
    el: "#app",
    data: {
        email: "",
        password: "",
        password_confirmation: "",
        jefe: 0,
        name: "",
        avatar: "../styles/images/users/perfil.png",
        login_registro: true
    },
    methods: {
        /* Metodos HTTP */
        logear() {
        
            axios.post(localStorage.getItem('URL_API')+'login', {
                email: this.email,
                password: this.password
            })
                .then(response => {
                    console.log(response)
                    if (response.data.access_token) {
                        localStorage.setItem("access_token", response.data.access_token);
                    }
                    window.location.href = '/pages/main.html'
                })
                .catch(error => {
                    console.log(error.response)

                });
        },
        registrarse() {
          
            axios.post(localStorage.getItem('URL_API')+'registrarse', {
                name:this.name,
                email: this.email,
                password: this.password,
                password_confirmation: this.password_confirmation,
                jefe:this.jefe,
                avatar:this.avatar
            })
                .then(response => {
                    console.log("registrado!")
                    window.location.href = ''
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