const nodemailer = require('nodemailer');

exports.enviarCorreo = (req, res) => {
    const { to, subject, message } = req.body;
    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
        // Configuración del servidor de correo saliente (SMTP)
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'tu_usuario',
            pass: 'tu_contraseña'
        }
    });
    // Configurar el correo electrónico a enviar
    const mailOptions = {
        from: 'no-reply@example.com',
        to: to,
        subject: subject,
        text: message
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo:', error);
            res.status(500).json({ message: 'Error al enviar el correo.' });
        } else {
            console.log('Correo enviado:', info.response);
            res.status(200).json({ message: 'Correo enviado correctamente.' });
        }
    });
};
