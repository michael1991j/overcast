export let deleteTemplate :string = 
`@odata.DELETE
async remove( @odata.key id: string ): Promise<number> {
    const request = await Overcast.request(config);
    const sqlCommand = \`DELETE FROM {{scheme}}{{entity}} OUTPUT deleted.* WHERE {{entitykey}} = '\`+ id +\`' \`;
    let result ;
    try {
    result = await request.query(sqlCommand);
    }
    catch (error) {
        console.log(error);
        const newrequest = Overcast.newRequest(config);

    }
    return (Array.isArray(result.recordsets[0])) ? result.recordsets[0].length : 0;
}`;