"use client"
import React, { useState } from 'react'
import axios, { AxiosError} from 'axios';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IoMdArrowBack } from 'react-icons/io';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registeruser, RegisterUser } from '@/validations/schema';
import Link from 'next/link';

interface Success {
  message: string;
  data:{
    token: string;
   }
}

interface Error {
    country: string;
    username: string,
  email: string;
  password: string;
  confirmPassword: string;

}

interface ResError {
  message: string;
  data: string
}

const Country = [ 
  {name: 'Afghanistan', code: 'AF'}, 
  {name: 'Åland Islands', code: 'AX'}, 
  {name: 'Albania', code: 'AL'}, 
  {name: 'Algeria', code: 'DZ'}, 
  {name: 'American Samoa', code: 'AS'}, 
  {name: 'AndorrA', code: 'AD'}, 
  {name: 'Angola', code: 'AO'}, 
  {name: 'Anguilla', code: 'AI'}, 
  {name: 'Antarctica', code: 'AQ'}, 
  {name: 'Antigua and Barbuda', code: 'AG'}, 
  {name: 'Argentina', code: 'AR'}, 
  {name: 'Armenia', code: 'AM'}, 
  {name: 'Aruba', code: 'AW'}, 
  {name: 'Australia', code: 'AU'}, 
  {name: 'Austria', code: 'AT'}, 
  {name: 'Azerbaijan', code: 'AZ'}, 
  {name: 'Bahamas', code: 'BS'}, 
  {name: 'Bahrain', code: 'BH'}, 
  {name: 'Bangladesh', code: 'BD'}, 
  {name: 'Barbados', code: 'BB'}, 
  {name: 'Belarus', code: 'BY'}, 
  {name: 'Belgium', code: 'BE'}, 
  {name: 'Belize', code: 'BZ'}, 
  {name: 'Benin', code: 'BJ'}, 
  {name: 'Bermuda', code: 'BM'}, 
  {name: 'Bhutan', code: 'BT'}, 
  {name: 'Bolivia', code: 'BO'}, 
  {name: 'Bosnia and Herzegovina', code: 'BA'}, 
  {name: 'Botswana', code: 'BW'}, 
  {name: 'Bouvet Island', code: 'BV'}, 
  {name: 'Brazil', code: 'BR'}, 
  {name: 'British Indian Ocean Territory', code: 'IO'}, 
  {name: 'Brunei Darussalam', code: 'BN'}, 
  {name: 'Bulgaria', code: 'BG'}, 
  {name: 'Burkina Faso', code: 'BF'}, 
  {name: 'Burundi', code: 'BI'}, 
  {name: 'Cambodia', code: 'KH'}, 
  {name: 'Cameroon', code: 'CM'}, 
  {name: 'Canada', code: 'CA'}, 
  {name: 'Cape Verde', code: 'CV'}, 
  {name: 'Cayman Islands', code: 'KY'}, 
  {name: 'Central African Republic', code: 'CF'}, 
  {name: 'Chad', code: 'TD'}, 
  {name: 'Chile', code: 'CL'}, 
  {name: 'China', code: 'CN'}, 
  {name: 'Christmas Island', code: 'CX'}, 
  {name: 'Cocos (Keeling) Islands', code: 'CC'}, 
  {name: 'Colombia', code: 'CO'}, 
  {name: 'Comoros', code: 'KM'}, 
  {name: 'Congo', code: 'CG'}, 
  {name: 'Congo, The Democratic Republic of the', code: 'CD'}, 
  {name: 'Cook Islands', code: 'CK'}, 
  {name: 'Costa Rica', code: 'CR'}, 
  {name: 'Cote D\'Ivoire', code: 'CI'}, 
  {name: 'Croatia', code: 'HR'}, 
  {name: 'Cuba', code: 'CU'}, 
  {name: 'Cyprus', code: 'CY'}, 
  {name: 'Czech Republic', code: 'CZ'}, 
  {name: 'Denmark', code: 'DK'}, 
  {name: 'Djibouti', code: 'DJ'}, 
  {name: 'Dominica', code: 'DM'}, 
  {name: 'Dominican Republic', code: 'DO'}, 
  {name: 'Ecuador', code: 'EC'}, 
  {name: 'Egypt', code: 'EG'}, 
  {name: 'El Salvador', code: 'SV'}, 
  {name: 'Equatorial Guinea', code: 'GQ'}, 
  {name: 'Eritrea', code: 'ER'}, 
  {name: 'Estonia', code: 'EE'}, 
  {name: 'Ethiopia', code: 'ET'}, 
  {name: 'Falkland Islands (Malvinas)', code: 'FK'}, 
  {name: 'Faroe Islands', code: 'FO'}, 
  {name: 'Fiji', code: 'FJ'}, 
  {name: 'Finland', code: 'FI'}, 
  {name: 'France', code: 'FR'}, 
  {name: 'French Guiana', code: 'GF'}, 
  {name: 'French Polynesia', code: 'PF'}, 
  {name: 'French Southern Territories', code: 'TF'}, 
  {name: 'Gabon', code: 'GA'}, 
  {name: 'Gambia', code: 'GM'}, 
  {name: 'Georgia', code: 'GE'}, 
  {name: 'Germany', code: 'DE'}, 
  {name: 'Ghana', code: 'GH'}, 
  {name: 'Gibraltar', code: 'GI'}, 
  {name: 'Greece', code: 'GR'}, 
  {name: 'Greenland', code: 'GL'}, 
  {name: 'Grenada', code: 'GD'}, 
  {name: 'Guadeloupe', code: 'GP'}, 
  {name: 'Guam', code: 'GU'}, 
  {name: 'Guatemala', code: 'GT'}, 
  {name: 'Guernsey', code: 'GG'}, 
  {name: 'Guinea', code: 'GN'}, 
  {name: 'Guinea-Bissau', code: 'GW'}, 
  {name: 'Guyana', code: 'GY'}, 
  {name: 'Haiti', code: 'HT'}, 
  {name: 'Heard Island and Mcdonald Islands', code: 'HM'}, 
  {name: 'Holy See (Vatican City State)', code: 'VA'}, 
  {name: 'Honduras', code: 'HN'}, 
  {name: 'Hong Kong', code: 'HK'}, 
  {name: 'Hungary', code: 'HU'}, 
  {name: 'Iceland', code: 'IS'}, 
  {name: 'India', code: 'IN'}, 
  {name: 'Indonesia', code: 'ID'}, 
  {name: 'Iran, Islamic Republic Of', code: 'IR'}, 
  {name: 'Iraq', code: 'IQ'}, 
  {name: 'Ireland', code: 'IE'}, 
  {name: 'Isle of Man', code: 'IM'}, 
  {name: 'Israel', code: 'IL'}, 
  {name: 'Italy', code: 'IT'}, 
  {name: 'Jamaica', code: 'JM'}, 
  {name: 'Japan', code: 'JP'}, 
  {name: 'Jersey', code: 'JE'}, 
  {name: 'Jordan', code: 'JO'}, 
  {name: 'Kazakhstan', code: 'KZ'}, 
  {name: 'Kenya', code: 'KE'}, 
  {name: 'Kiribati', code: 'KI'}, 
  {name: 'Korea, Democratic People\'S Republic of', code: 'KP'}, 
  {name: 'Korea, Republic of', code: 'KR'}, 
  {name: 'Kuwait', code: 'KW'}, 
  {name: 'Kyrgyzstan', code: 'KG'}, 
  {name: 'Lao People\'S Democratic Republic', code: 'LA'}, 
  {name: 'Latvia', code: 'LV'}, 
  {name: 'Lebanon', code: 'LB'}, 
  {name: 'Lesotho', code: 'LS'}, 
  {name: 'Liberia', code: 'LR'}, 
  {name: 'Libyan Arab Jamahiriya', code: 'LY'}, 
  {name: 'Liechtenstein', code: 'LI'}, 
  {name: 'Lithuania', code: 'LT'}, 
  {name: 'Luxembourg', code: 'LU'}, 
  {name: 'Macao', code: 'MO'}, 
  {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'}, 
  {name: 'Madagascar', code: 'MG'}, 
  {name: 'Malawi', code: 'MW'}, 
  {name: 'Malaysia', code: 'MY'}, 
  {name: 'Maldives', code: 'MV'}, 
  {name: 'Mali', code: 'ML'}, 
  {name: 'Malta', code: 'MT'}, 
  {name: 'Marshall Islands', code: 'MH'}, 
  {name: 'Martinique', code: 'MQ'}, 
  {name: 'Mauritania', code: 'MR'}, 
  {name: 'Mauritius', code: 'MU'}, 
  {name: 'Mayotte', code: 'YT'}, 
  {name: 'Mexico', code: 'MX'}, 
  {name: 'Micronesia, Federated States of', code: 'FM'}, 
  {name: 'Moldova, Republic of', code: 'MD'}, 
  {name: 'Monaco', code: 'MC'}, 
  {name: 'Mongolia', code: 'MN'}, 
  {name: 'Montserrat', code: 'MS'}, 
  {name: 'Morocco', code: 'MA'}, 
  {name: 'Mozambique', code: 'MZ'}, 
  {name: 'Myanmar', code: 'MM'}, 
  {name: 'Namibia', code: 'NA'}, 
  {name: 'Nauru', code: 'NR'}, 
  {name: 'Nepal', code: 'NP'}, 
  {name: 'Netherlands', code: 'NL'}, 
  {name: 'Netherlands Antilles', code: 'AN'}, 
  {name: 'New Caledonia', code: 'NC'}, 
  {name: 'New Zealand', code: 'NZ'}, 
  {name: 'Nicaragua', code: 'NI'}, 
  {name: 'Niger', code: 'NE'}, 
  {name: 'Nigeria', code: 'NG'}, 
  {name: 'Niue', code: 'NU'}, 
  {name: 'Norfolk Island', code: 'NF'}, 
  {name: 'Northern Mariana Islands', code: 'MP'}, 
  {name: 'Norway', code: 'NO'}, 
  {name: 'Oman', code: 'OM'}, 
  {name: 'Pakistan', code: 'PK'}, 
  {name: 'Palau', code: 'PW'}, 
  {name: 'Palestinian Territory, Occupied', code: 'PS'}, 
  {name: 'Panama', code: 'PA'}, 
  {name: 'Papua New Guinea', code: 'PG'}, 
  {name: 'Paraguay', code: 'PY'}, 
  {name: 'Peru', code: 'PE'}, 
  {name: 'Philippines', code: 'PH'}, 
  {name: 'Pitcairn', code: 'PN'}, 
  {name: 'Poland', code: 'PL'}, 
  {name: 'Portugal', code: 'PT'}, 
  {name: 'Puerto Rico', code: 'PR'}, 
  {name: 'Qatar', code: 'QA'}, 
  {name: 'Reunion', code: 'RE'}, 
  {name: 'Romania', code: 'RO'}, 
  {name: 'Russian Federation', code: 'RU'}, 
  {name: 'RWANDA', code: 'RW'}, 
  {name: 'Saint Helena', code: 'SH'}, 
  {name: 'Saint Kitts and Nevis', code: 'KN'}, 
  {name: 'Saint Lucia', code: 'LC'}, 
  {name: 'Saint Pierre and Miquelon', code: 'PM'}, 
  {name: 'Saint Vincent and the Grenadines', code: 'VC'}, 
  {name: 'Samoa', code: 'WS'}, 
  {name: 'San Marino', code: 'SM'}, 
  {name: 'Sao Tome and Principe', code: 'ST'}, 
  {name: 'Saudi Arabia', code: 'SA'}, 
  {name: 'Senegal', code: 'SN'}, 
  {name: 'Serbia and Montenegro', code: 'CS'}, 
  {name: 'Seychelles', code: 'SC'}, 
  {name: 'Sierra Leone', code: 'SL'}, 
  {name: 'Singapore', code: 'SG'}, 
  {name: 'Slovakia', code: 'SK'}, 
  {name: 'Slovenia', code: 'SI'}, 
  {name: 'Solomon Islands', code: 'SB'}, 
  {name: 'Somalia', code: 'SO'}, 
  {name: 'South Africa', code: 'ZA'}, 
  {name: 'South Georgia and the South Sandwich Islands', code: 'GS'}, 
  {name: 'Spain', code: 'ES'}, 
  {name: 'Sri Lanka', code: 'LK'}, 
  {name: 'Sudan', code: 'SD'}, 
  {name: 'Suriname', code: 'SR'}, 
  {name: 'Svalbard and Jan Mayen', code: 'SJ'}, 
  {name: 'Swaziland', code: 'SZ'}, 
  {name: 'Sweden', code: 'SE'}, 
  {name: 'Switzerland', code: 'CH'}, 
  {name: 'Syrian Arab Republic', code: 'SY'}, 
  {name: 'Taiwan, Province of China', code: 'TW'}, 
  {name: 'Tajikistan', code: 'TJ'}, 
  {name: 'Tanzania, United Republic of', code: 'TZ'}, 
  {name: 'Thailand', code: 'TH'}, 
  {name: 'Timor-Leste', code: 'TL'}, 
  {name: 'Togo', code: 'TG'}, 
  {name: 'Tokelau', code: 'TK'}, 
  {name: 'Tonga', code: 'TO'}, 
  {name: 'Trinidad and Tobago', code: 'TT'}, 
  {name: 'Tunisia', code: 'TN'}, 
  {name: 'Turkey', code: 'TR'}, 
  {name: 'Turkmenistan', code: 'TM'}, 
  {name: 'Turks and Caicos Islands', code: 'TC'}, 
  {name: 'Tuvalu', code: 'TV'}, 
  {name: 'Uganda', code: 'UG'}, 
  {name: 'Ukraine', code: 'UA'}, 
  {name: 'United Arab Emirates', code: 'AE'}, 
  {name: 'United Kingdom', code: 'GB'}, 
  {name: 'United States', code: 'US'}, 
  {name: 'United States Minor Outlying Islands', code: 'UM'}, 
  {name: 'Uruguay', code: 'UY'}, 
  {name: 'Uzbekistan', code: 'UZ'}, 
  {name: 'Vanuatu', code: 'VU'}, 
  {name: 'Venezuela', code: 'VE'}, 
  {name: 'Viet Nam', code: 'VN'}, 
  {name: 'Virgin Islands, British', code: 'VG'}, 
  {name: 'Virgin Islands, U.S.', code: 'VI'}, 
  {name: 'Wallis and Futuna', code: 'WF'}, 
  {name: 'Western Sahara', code: 'EH'}, 
  {name: 'Yemen', code: 'YE'}, 
  {name: 'Zambia', code: 'ZM'}, 
  {name: 'Zimbabwe', code: 'ZW'} 
]

export default function login() {
    const [ loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const [auth, setAuth] = useState<string | null>(null)

    const [ email, setEmail] = useState('')
    const [ username, setUsername] = useState('')
    const [ password, setPassword] = useState('')
    const [ passwordconfirm, setPasswordConfirm] = useState('')
    const [ country, setCountry] = useState('')
    const [isFormValid, setIsFormValid] = useState(false); 
    const [ success, setSuccess] = useState<Success>()
    // const [errors, setErrors] = useState<Error | null>( null);

      //form validation
      const {
        register,
        handleSubmit,
        setValue,
        reset,
        trigger,
        formState: { errors },
    } = useForm<RegisterUser>({
        resolver: zodResolver(registeruser),
        defaultValues: {
           
        },
    })


    {/*Register*/}
    const handleRegisterUser = async (data: RegisterUser) => {
      setLoading(true)

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`,{
            username: data.username,
            password: data.password,
            email: data.email,
            // country: data.country
        },{
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          }
        })
        setLoading(false)

        setUsername('')
        setPassword('')
        setPasswordConfirm('')
        setEmail('')
        setCountry('')
        console.log(response.data)
        if (response.data.message === 'success') {
          router.push('/auth/login')
          setLoading(false)
           toast({
            title: "Success",
            description: "Successfully registered",
          })
        }

        if (response.data.message === 'failed') {
          setLoading(false)
         toast({
          variant: "destructive",
          title: "Error",
          description: "",
        })
        }
        setLoading(false)
      } catch (error: any) {
        if (error.response.data.data != null){
          setLoading(false)
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response.data.data,
          })
        }
        else{
          setLoading(false)
          toast({
            variant: "destructive",
            title: "Error",
            description: "There's a problem with the server! Please contact customer support for more details",
          })
        }
      }
    
    }


    const back = () => {
      router.push('/auth/user/')
    }



  return (
    <div className=' relative bg-[#141414] w-screen h-screen flex items-center justify-center '
     style={{backgroundImage: "url('/login/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
    >


     
      <Link href="/auth/user/">
        <img src="/login/Rise of Fearless plain.png" width={100} alt="" className=' hidden xl:block absolute top-8 left-8'/>
      </Link>


 

      <div className=' h-screen w-full flex items-center justify-center'>
        <div className=' relative grid grid-cols-1 md:grid-cols-2 w-[95%] md:w-[700px] xl:w-[800px] bg-red-900 rounded-md'
     style={{backgroundImage: "url('/login/Login Tab.png')", backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat:"no-repeat"}}
        >

           <button onClick={back} className=' absolute top-4 left-6 bg-orange-300 rounded-md px-2 py-1 text-amber-950 flex items-center justify-center gap-2 hover:scale-110 ease-in-out duration-200 mb-2'>
            <IoMdArrowBack size={15}/>
            <p className=' text-xs'>Back</p>
          </button>
                    

              <div className=' w-full flex flex-col items-start gap-2 lg:gap-4 p-6'>
                 <div className=' flex flex-col items-start mt-8'>
                  <img src="/login/Rise of Fearless plain.png" width={100} alt="" className=' xl:hidden block'/>
                  <p className=' text-lg font-semibold text-orange-300'>Sign Up</p>
                  <p className=' text-xs text-zinc-400 mb-2'>Enter your account details</p>

                </div>

                <form onSubmit={handleSubmit(handleRegisterUser)} className=' w-full flex flex-col gap-2'>
                  <Input placeholder='Username' type='text' className=' bg-zinc-950 border-orange-300 text-white' {...register('username')}/>
                  <p className=" text-[.6rem] text-red-500">{errors.username?.message}</p>

                      <Input placeholder='Password' type='password' className=' bg-zinc-950 border-orange-300 text-white ' {...register('password')}/>
                    <p className=" text-[.6rem] text-red-500">{errors.password?.message}</p>

                      <Input placeholder='Confirm password' type='password' className=' bg-zinc-950 border-orange-300 text-white ' {...register('confirmPassword')}/>
                    <p className=" text-[.6rem] text-red-500">{errors.confirmPassword?.message}</p>



                      <Input placeholder='Email' type='email' className=' bg-zinc-950 text-white border-orange-300' {...register('email')}/>
                    <p className=" text-[.6rem] text-red-500">{errors.email?.message}</p>


                      {/* <Select  onValueChange={(value) => setValue('country', value)} {...register('country')}>
                      <SelectTrigger className="w-full bg-zinc-950 border-orange-300 text-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className=' bg-zinc-950 border-orange-300 text-white'>
                        {Country.map((list, idx) => (
                          <SelectItem key={idx} value={list.code}>{list.name}</SelectItem>

                        ))}
                      </SelectContent>
                    </Select>

                    <p className=" text-[.6rem] text-red-500">{errors.country?.message}</p> */}



                  
                      <button
                       
                        className=' flex items-center justify-center gap-2 py-2 w-full lg:text-sm xl:text-lg font-bold text-amber-950  ease-in-out duration-200 bg-gradient-to-r from-orange-300 to-orange-400 rounded-md'
                        >
                           { loading === true && (
                          <div className="loader">
                              <div className="bar1 bg-zinc-950"></div>
                              <div className="bar2 bg-zinc-950"></div>
                              <div className="bar3 bg-zinc-950"></div>
                              <div className="bar4 bg-zinc-950"></div>
                              <div className="bar5 bg-zinc-950"></div>
                              <div className="bar6 bg-zinc-950"></div>
                              <div className="bar7 bg-zinc-950"></div>
                              <div className="bar8 bg-zinc-950"></div>
                              <div className="bar9 bg-zinc-950"></div>
                              <div className="bar10 bg-zinc-950"></div>
                              <div className="bar11 bg-zinc-950"></div>
                              <div className="bar12 bg-zinc-950"></div>
                          </div>
                        )}
                          Sign up</button>

                </form>
                      

                        
                <p className=' text-xs text-zinc-400 mt-4 flex items-center gap-6'>Already have an account?<Link href="/auth/user/username" className=' text-xs font-semibold px-4 py-1 border-2 border-orange-400 rounded-md text-orange-400'>Log In</Link></p>


              </div>

              <div className=' relative md:flex items-end justify-end h-full w-full ml-10 hidden'>
          <img src="/login/Login Tab Character.png" width={300} alt="" className=' absolute bottom-0 right-0 md:block hidden'/>
              </div>

          </div>
      </div>

    </div>
  )
}
