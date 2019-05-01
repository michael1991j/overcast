export let putTemplate :string = 

    `@odata.PUT
async overrite( @odata.key id: string, @odata.body data: any, @odata.context context: any ): Promise<{{entity}}> {
    const request = await Overcast.request(config);
    const sqlCommandDelete = \`DELETE FROM {{scheme}}{{entity}} OUTPUT deleted.* WHERE {{entitykey}} = '\${id}'\`;

    await request.query(sqlCommandDelete);
    const product = Object.assign({}, data, { Id: id });
    const columns = Object.keys(product);
    const insertedColumns = Object.keys(product).map(key => "inserted." + key);
    const values = Object.keys(product).map(key => Overcast.getConvertedValue(product[key]));
    const sqlCommand = \`SET IDENTITY_INSERT {{scheme}}{{entity}} ON;
    INSERT INTO {{scheme}}{{entity}} (\${columns.join(", ")}) OUTPUT \${insertedColumns.join(", ")} VALUES (\${values.join(", ")});
    SET IDENTITY_INSERT {{scheme}}{{entity}} OFF;\`;
     let result ; 
     result = await request.query(sqlCommand);
    return  result.recordsets[0];
}`;
