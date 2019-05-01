export let getTemplate :string = 
`@odata.GET("sensors")
async getSensor( @odata.result box: SensorBox, @odata.query query: ODataQuery): Promise<{{{entity}}}[]> {
    const request = await Overcast.request(config);
    const sqlQuery = createQuery(query);
    sqlQuery.parameters.forEach((value, name) => request.input(name, value));
    request.input("id", box.SerialNum);
    const result = await request.query("SELECT \${sqlQuery.select} FROM Sensors WHERE SerialNum = '" + box.SerialNum + "' AND (\${sqlQuery.where})");
    return result.recordsets[0];
}`;
