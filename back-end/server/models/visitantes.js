module.exports=(sequelize,DataTypes)=>{
    const visitantes=sequelize.define('visitantes',{
        fecha_actual:{
            primaryKey:true,
            allowNull:false,
            notNull:true,
            type:DataTypes.DATE
        },
        nombre:DataTypes.STRING,
        apellido_paterno:DataTypes.STRING,
        apellido_materno:DataTypes.STRING,
        empresa_visita:DataTypes.STRING,
        a_quien_visita:DataTypes.STRING,
        fecha_entrada:{
            primaryKey:true,
            allowNull:false,
            notNull:true,
            type:DataTypes.DATE
        },
        fecha_salida:{
            primaryKey:true,
            allowNull:false,
            notNull:true,
            type:DataTypes.DATE
        },
        correo:{
            primaryKey:true,
            allowNull:false,
            notNull:true,
            type:DataTypes.STRING
        },
        celular:DataTypes.STRING,
        motivo:DataTypes.STRING,
        user_id:DataTypes.INTEGER,
        activo:DataTypes.BOOLEAN,
        createdAt:DataTypes.DATE,
        updatedAt:DataTypes.DATE
    });
    return visitantes;
}