export let findOneTemplate :string = 
`@odata.GET
async findOne( @odata.key id: string, @odata.stream stream :any, @odata.query query: ODataQuery): Promise<{{{entity}}}> {
    const request = await Overcast.request(config);
    const sqlQuery = createQuery(query);
    sqlQuery.parameters.forEach((value :any , name :any) => request.input(name, value));
     let result ;
    try {
     result =  await request.query(\`SELECT \${sqlQuery.select} FROM {{scheme}}{{entity}} WHERE {{entitykey}} = '\`+ id+\`' AND (\${sqlQuery.where})\`);
   
    }
    catch (error) {
        console.log(error);
        const newrequest = Overcast.newRequest(config);

    }
    return result.recordsets[0][0];

}`;