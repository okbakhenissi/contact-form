const sendContactEmail = async function() {
  try {
    const token = await grecaptcha.enterprise.execute('6LexNnYlAAAAAN1MGk6LSdWVYGBcl2AxqWy2WxNP', {action: 'contact'});
    const score = await verify(token);
    if(score > 0.7) {
      const name = document.getElementById("name");
      const email = document.getElementById("email")
      const message = document.getElementById("message");
      const body = {
        name : name.value,
        email : email.value,
        message : message.value,
        token : token,
      }

      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const responseJson = await response.json();
      console.log(responseJson);
      console.log('The email has been sent');
    }
  } catch(error) {
    console.log(error);
  }
}

const verify = async function(token) {
  try {
    const body = {
      token : token
    }
    const response = await fetch("http://localhost:3000/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    return responseJson.score;
  } catch(error) {
    console.log(error);
  }
}