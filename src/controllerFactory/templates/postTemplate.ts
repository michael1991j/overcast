
    export let postTemplate :string = 

    `@odata.POST
    async insert( @odata.body data: any): Promise<{{entity}}> {
        const request = await Overcast.request(config);
        const columns = Object.keys(data);
        const values = Object.keys(data).map(key => Overcast.getConvertedValue(data[key]));
        const sqlCommand = \`INSERT INTO {{scheme}}{{entity}} (\${columns.join(", ")}) OUTPUT inserted.* VALUES (\${values.join(", ")});\`;
        let result ;
        try {
         result = await request.query(sqlCommand);
        }
        catch (error) {
            console.log(error);
            const newrequest = Overcast.newRequest(config);

        }
        return data;
    }`;