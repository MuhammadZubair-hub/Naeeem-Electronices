type AVM = {
    AVM_name: string,
    AVM_total_AD: string,
    AVM_total_In: string,
    AVM_total_AR : string,
};

type Branches = {
    name: string,
    B_total_AD: string,
    B_total_In: string,
    B_total_AR : string,
    B_AVO: string,
    B_AVM: AVM[],
}
type ZonalManager = {
    name: string,
    total_AR :string,
        total_AD: string,
        total_In: string,
        branches: Branches [],
}

 export type PerUserComponentsProps ={
        mangers : ZonalManager,
    }

export const zonalmangerData : ZonalManager[] = [
    {
        name: "Zonal Manger1",
        total_AR :'0',
        total_AD: '0',
        total_In: '0',
        branches: [
            {
                name: 'Model Town',
                B_total_AD: '0',
                B_total_In: '0',
                B_total_AR:"0",
                B_AVO: 'Abdul Rehman',
                B_AVM: [
                    {
                        AVM_name: 'AVM 1',
                        AVM_total_AD: '10',
                        AVM_total_In: '5',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'AVM 2',
                        AVM_total_AD: '10',
                        AVM_total_In: '5',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'AVM 3',
                        AVM_total_AD: '4',
                        AVM_total_In: '2',
                        AVM_total_AR :'9'
                    },
                ]
            },
            {
                name: 'Gulberg',
                B_total_AD: '0',
                B_total_In: '0',
                B_total_AR:"0",
                B_AVO: 'Abdul Rehman',
                B_AVM: [
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                ]
            },
        ]
    },
     {
        name: "Zonal Manger 2",
        total_AR :'0',
        total_AD: '0',
        total_In: '0',
        branches: [
            {
                name: 'Model Town',
                B_total_AD: '0',
                B_total_In: '0',
                B_total_AR:"0",
                B_AVO: 'Abdul Rehman',
                B_AVM: [
                    {
                        AVM_name: 'AVM 1',
                        AVM_total_AD: '10',
                        AVM_total_In: '5',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'AVM 2',
                        AVM_total_AD: '10',
                        AVM_total_In: '5',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'AVM 3',
                        AVM_total_AD: '4',
                        AVM_total_In: '2',
                        AVM_total_AR :'9'
                    },
                ]
            },
            {
                name: 'Gulberg',
                B_total_AD: '0',
                B_total_In: '0',
                B_total_AR:"0",
                B_AVO: 'Abdul Rehman',
                B_AVM: [
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                ]
            },
        ]
    },
      {
        name: "Zonal Manger 3",
        total_AR :'0',
        total_AD: '0',
        total_In: '0',
        branches: [
            {
                name: 'Model Town',
                B_total_AD: '0',
                B_total_In: '0',
                B_total_AR:"0",
                B_AVO: 'Abdul Rehman',
                B_AVM: [
                    {
                        AVM_name: 'AVM 1',
                        AVM_total_AD: '10',
                        AVM_total_In: '5',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'AVM 2',
                        AVM_total_AD: '10',
                        AVM_total_In: '5',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'AVM 3',
                        AVM_total_AD: '4',
                        AVM_total_In: '2',
                        AVM_total_AR :'9'
                    },
                ]
            },
            {
                name: 'Gulberg',
                B_total_AD: '0',
                B_total_In: '0',
                B_total_AR:"0",
                B_AVO: 'Abdul Rehman',
                B_AVM: [
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                ]
            },
        ]
    },
      {
        name: "Zonal Manger 4",
        total_AR :'0',
        total_AD: '0',
        total_In: '0',
        branches: [
            {
                name: 'Model Town',
                B_total_AD: '0',
                B_total_In: '0',
                B_total_AR:"0",
                B_AVO: 'Abdul Rehman',
                B_AVM: [
                    {
                        AVM_name: 'AVM 1',
                        AVM_total_AD: '10',
                        AVM_total_In: '5',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'AVM 2',
                        AVM_total_AD: '10',
                        AVM_total_In: '5',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'AVM 3',
                        AVM_total_AD: '4',
                        AVM_total_In: '2',
                        AVM_total_AR :'9'
                    },
                ]
            },
            {
                name: 'Gulberg',
                B_total_AD: '0',
                B_total_In: '0',
                B_total_AR:"0",
                B_AVO: 'Abdul Rehman',
                B_AVM: [
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                    {
                        AVM_name: 'thsih',
                        AVM_total_AD: '0',
                        AVM_total_In: '0',
                        AVM_total_AR :'9'
                    },
                ]
            },
        ]
    },
]