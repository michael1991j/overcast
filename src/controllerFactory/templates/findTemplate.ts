export let findTemplate :string = 

`@odata.GET
async find( @odata.stream stream :any, @odata.query query: ODataQuery): Promise<{{entity}}[] | void> {
    const request = await Overcast.request(config);
    const sqlQuery = createQuery(query);
    sqlQuery.parameters.forEach((value :any, name :any) => request.input(name, value));
    let result =  await    request.query(sqlQuery.from("{{scheme}}{{entity}}"));
    
    return result.recordsets[0];
}`;
