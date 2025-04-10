const baseUrl = "http://127.0.0.1:9000/security";

const validateProfile = (file, supported) =>{
    if(file.name){
        return supported.includes(file && (file.name.split(".")[1]).toLowerCase())
    }else{
        return "empty"
    }
}



const post = (payload) =>{
    return {
            method:"POST",
            //sending request without the header
            // headers:{
            //     "Content-type": "application/json",
            // },
            body:payload
    }
}


const warningLabel = (message) =>{
    const warningContainer = document.querySelector(".alert-warning")
    if(message){
        warningContainer.classList.remove("d-none")
        warningContainer.classList.add("d-block")
        warningContainer.textContent = message
    }

}

const handleRegistration = (event) =>{
    event.preventDefault()
    const formData = new FormData(event.target)
    const fileType = ["jpg", "jpeg", "png"]

    clearWarning()
    const firstname = formData.get("firstname")
    const lastname = formData.get("lastname")
    const email = formData.get("email")
    const department = formData.get("department")
    const level = formData.get("level")
    const matric = formData.get("matric")
    const password = formData.get("password")
    const confirmPass = formData.get("confirmPass")
    const profile = formData.get("profile")



    if(firstname.trim() === "" || lastname.trim() === "" || email.trim() === "" || department.trim() === ""|| level.trim() === "" || matric.trim() === ""|| password.trim() === "" || confirmPass.trim() === ""){
        warningLabel("ensure all the fields are filled")
    }else if(password !== confirmPass){
        warningLabel("password and comfrim password must match")
    }else if(profile.name === ""){
        warningLabel("ensure you choose your profile picture")
    }else if(!validateProfile(profile, fileType)){
        warningLabel("file type not supported")
    }
    else{
        const data = {
            firstname : firstname,
            lastname: lastname,
            email:email,
            department: department,
            level: level,
            matric: matric,
            password: password,
        }
        formData.append("student_details", JSON.stringify(data))
        formData.append("file", profile)
        submitRegistrationForm(formData, event)
    }
    
}


const handleLogin = (event) =>{
    event.preventDefault()
    const formData = new FormData(event.target)
    clearWarning()

    const matric = formData.get("matric")
    const password = formData.get("password")

    if(matric.trim() === ""|| password.trim() ===""){
        warningLabel("ensure the filed is filled")
    }else{
        const data = {
            matric:matric,
            password:password
        }
        formData.append("student_details", JSON.stringify(
            data
        ))
        submitLoinForm(formData, event)
    }
}






const clearWarning = () =>{
    document.querySelector(".alert-warning").classList.add("d-none")
}





// communicate with backend api

const submitRegistrationForm = async (payload, event) =>{
    try{
        const fetchData = await fetch(`${baseUrl}/registration`,post(payload))
        if(fetchData.ok){
            const data = await fetchData.json()
            event.target.reset()
            // navigate to login page
            console.log(data)
        }
        else{
            throw new Error("error submitting form")
        }

    }catch(error){
        console.log("error due to ", error)
    }
}


const submitLoinForm = async (payload, event) =>{
    try{
        const fetchData = await fetch(`${baseUrl}/login`, post(payload))
        if(fetchData.ok){
            const data = await fetchData.json()
            event.target.reset()
            warningLabel("welcome student")
            //naivgate to dashboard
        }
        else{
            throw new Error("error submitting form")
        }

    }catch(error){
        console.log("error due to ", error)

    }
}