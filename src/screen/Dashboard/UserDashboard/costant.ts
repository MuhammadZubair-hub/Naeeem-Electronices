type Branch ={
        name :string,
        total_IV: string,
        total_AD: string
    };

    type ZonalData = {
        user : string,
        branches : Branch[],
    };

    export type PerUserComponentsProps ={
        userText : ZonalData,
    }
    


   export  const zonalData : ZonalData [] =  [
        {
            user: 'manger 1',
            branches: [
                {
                    name: 'Model Town',
                    total_IV: '10',
                    total_AD: "N/A"
                },
                {
                    name: 'Gulberg',
                    total_IV: '10',
                    total_AD: "N/A"
                },
                {
                    name: 'Bedain Road',
                    total_IV: '10',
                    total_AD: "N/A"
                }
            ],

        },
        {
            user: 'manger 2',
            branches: [
                {
                    name: 'Model Town',
                    total_IV: '10',
                    total_AD: "N/A"
                },
                {
                    name: 'Gulberg',
                    total_IV: '10',
                    total_AD: "N/A"
                },
                {
                    name: 'Bedain Road',
                    total_IV: '10',
                    total_AD: "N/A"
                }
            ],

        },
        {
            user: 'manger 3',
            branches: [
                {
                    name: 'Model Town',
                    total_IV: '10',
                    total_AD: "N/A"
                },
                {
                    name: 'Gulberg',
                    total_IV: '10',
                    total_AD: "N/A"
                },
                {
                    name: 'Bedain Road',
                    total_IV: '10',
                    total_AD: "N/A"
                }
            ],

        }
    ]