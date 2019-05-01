export let patchTemplate :string = 

`@odata.PATCH
async update( @odata.key id: string, @odata.body delta: any ): Promise<number> {
    const request = await Overcast.request(config);
    const sets = Object.keys(delta).map(key => key + "=" + Overcast.getConvertedValue(delta[key]));
    const sqlCommand = \`DECLARE @impactedId INT;
    UPDATE {{scheme}}{{entity}} SET \${sets.join(", ")}, @impactedId = Id WHERE  {{entitykey}} = '\${id}';
    SELECT @impactedId as 'ImpactedId';\`;
    const result = await request.query(sqlCommand);
    return (result) ? 1 : 0;
}`;
  