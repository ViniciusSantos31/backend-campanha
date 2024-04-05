export const template: string = `<!-- 
Online HTML, CSS and JavaScript editor to run code online.
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="style.css" />
  <title>Plantão - PROCON</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: sans-serif;
    }

    .wrapper {
      width: 100%;
      background-color: #cccccc;
    }

    .main {
      width: 100%;
      height: 100%;
      max-width: 600px;
      background-color: #fff;
    }

    .logo-name {
      font-size: 24px;
    }
    
    .logo {
    	margin-top: 60px;
    }

    .logo h2 {
        margin: 0;
        font-size: 48px;
    }

    span.message {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 16px;
      font-size: 16px;
      margin-bottom: 60px;
    }

    .content {
      height: 30px;
    }

    .code {
      font-size: 48px;
      font-weight: 600;
      letter-spacing: 16px;
      margin-left: 16px;
    }

    .code-container {
      font-size: 48px;
      font-weight: 600;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-top: 36px;
    }

    .obs {
      margin-top: 36px;
      margin-bottom: 60px;
    }

    .obs small {
      color: #71717A;
    }

    .button-container {
      margin-top: 24px;
    }

    .button-container button {
      all: unset;
      padding: 16px;
      background-color: #000;
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <center class="wrapper">
    <table class="main" width="100%">
    	<tr>
          <td height="8" style="background-color: #171a1b;" />
      	</tr>
      	<tr class="content">
          <td>
            <center>
            <table>
                <center class="logo">
                  <b class="logo-name">Plantão</b>
                  <h2>
                    PROCON
                  </h2>
                </center>
                <center class="message">
                  Aqui está o código de verificação para redefinição 				de senha.
                </center>
                <center class="code-container">
                  <p id="code" class="code">4567</p>
                </center>
                <center class="obs">
                  <small>
                    Lembre-se de que o código expira após 10 minutos.					</small>
                </center>
            </table>
            </center>
           </td>
      	</tr>
    </table>
  </center>
  <script src="script.js"></script>
</body>
</html>`