'use client'
import { toast } from '@/components/ui/use-toast'
import { Delete, Eye, Plus, Trash2 } from 'lucide-react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import axios, { AxiosError } from 'axios'
import { FiCheck } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
  

type FormData = {
    title: string;
    content: string;
    image: File | null;
    previewUrl: string | null; // For displaying the image preview
  };

export default function Maps() {
    const [formData, setFormData] = useState<FormData[]>([
        { title: '', content: '', image: null, previewUrl: null },
      ]);
      const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isValidated, setIsvalidated] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
    const router = useRouter();

    React.useEffect(() => {
        if (!api) {
        return
        }
    
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
    
        api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])


    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (selectedFile) {
        }
    }, [selectedFile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleImageChange(e);
        handleFileChange(e);
      };



      const handleAddForm = () => {
        const lastForm = formData[formData.length - 1];
        const isFormComplete = Object.values(lastForm).every(value => value !== '' && value !== null);
    
        if (!isFormComplete) {
          toast({
            variant: 'destructive',
            description: 'Please fill all the fields',
            duration: 200,
          });
          return;
        }
    
        setFormData([...formData, { title: '', content: '', image: null, previewUrl: null }]);
      };
    
      const handleRemoveForm = (index: number) => {
        setFormData(formData.filter((_, i) => i !== index));
      };
    
      const handleChangeForm = (index: number, field: keyof FormData, value: string | File | null) => {
        setFormData((prevFormData) => {
          const newFormData = [...prevFormData];
          if (field === 'image' && value instanceof File) {
            newFormData[index].image = value;
            newFormData[index].previewUrl = URL.createObjectURL(value); // Generate and set the preview URL
          } else if (field === 'title' || field === 'content') {
            newFormData[index][field] = value as string;
          }
          return newFormData;
        });
      };


      const handleCreateMap = async () => {
        const formDataToSend = new FormData()

        formData.forEach(obj => {
            formDataToSend.append('mapObjectArray', JSON.stringify({
                title: obj.title,
                description: obj.content,
                image: obj.image,
                previewUrl: obj.previewUrl,
                type: 'map'
            }))
            if(obj.image){
                formDataToSend.append('image', obj.image);
            }
        })
        
        if(formData.length > 0){
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/content/mapcontent`, 
                     formDataToSend,
                     {                
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            }
                     })
                     if ( response.data.message === 'success'){
                        setFormData([])
                        setSelectedFile(null)
                        setSelectedImage(null)
                          toast({
                            description:(<div className=' flex items-center gap-2'><FiCheck size={20} /><p>News successfully created</p></div>)
                            })
                    }
    
                     if ( response.data.message === 'failed'){
                        setFormData([])
                        setSelectedFile(null)
                        setSelectedImage(null)
                          toast({
                            variant:'destructive',
                            description:(<div className=' flex items-center gap-2'><FiCheck size={20} /><p>{response.data.data}</p></div>)
                            })
                    }
                    if ( response.data.message === 'bad-request'){
                        setFormData([])
                        setSelectedFile(null)
                        setSelectedImage(null)
                          toast({
                            variant:'destructive',
                            description:(<div className=' flex items-center gap-2'><FiCheck size={20} /><p>{response.data.data}</p></div>)
                            })
                    }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message: string, data: string }>;
                    if (axiosError.response && axiosError.response.status === 401) {
                        router.push('/')
                        toast({
                        variant: "destructive",
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }

                      if (axiosError.response && axiosError.response.status === 400) {
                        const errorMessage = axiosError.response.data?.message;
                        toast({
                        variant: "destructive",
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }
                }
            }
        }

      }




      // fetch map list

      useEffect(() =>{
        const news = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/content/getcontent?limit=10`,{
                     withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        }
                })
            } catch (error) {
                 if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message: string, data: string }>;
                    if (axiosError.response && axiosError.response.status === 401) {
                        router.push('/')
                        toast({
                        variant: "destructive",
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }

                      if (axiosError.response && axiosError.response.status === 400) {
                        const errorMessage = axiosError.response.data?.message;
                        toast({
                        variant: "destructive",
                        title: `${axiosError.response.data.message}`,
                        description: `${axiosError.response.data.data}`
                        })
                
                    }
                } 
                
            }
        }
        news()
    },[])
      


  return (
    <div className=' w-full flex-col gap-12'>
        {formData.map((item, index) => (
            <div key={index} className=' w-full flex flex-col gap-8 mt-4 md:mt-8'>
                <div className=' w-full grid grid-cols-1 md:grid-cols-2 gap-12 text-xs'>
        
                <div className=' w-full flex flex-col gap-4 '>
                    <label htmlFor="">Title</label>
                    <input value={item.title} onChange={(e) => handleChangeForm(index, 'title' , e.target.value)} placeholder='Title' className=' p-4 bg-zinc-800 rounded-md'/>
                    <label htmlFor="">Content</label>
                    <textarea  value={item.content} onChange={(e) => handleChangeForm(index, 'content' , e.target.value)} placeholder='Content' className=' h-[300px] p-4 bg-zinc-800 rounded-md'/>
        
                </div>
        
                <div className=' w-full flex flex-col gap-4'>
                    <label htmlFor="">Image</label>
        
                    <div className=' w-full flex items-center justify-center aspect-video bg-zinc-800'>
                        {item.previewUrl ? (
                        <img src={item.previewUrl} alt="Preview" className="w-full aspect-video" />
                        ) : (
                        <p className="text-gray-500 text-center">No image selected</p>
                        )}
                    </div>
        
                    <input  onChange={(e) => handleChangeForm(index, 'image', e.target.files ? e.target.files[0] : null)}  type="file"  accept="image/*" />
        
                    <div className=' w-full flex items-end justify-end gap-4 text-xs'>
                       
                        {index !== 0 && (
                            <button onClick={() => handleRemoveForm(index)} className=' bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2'><Trash2 size={15}/>Delete</button>
                        )}
        
        
                    </div>
                
                
        
                </div>
        
                </div>
        
            </div>
        ))}

            <div className=' w-full flex flex-col gap-4 mt-12'> 
                <div className=' w-full flex items-end justify-end gap-4 text-xs'>
                    <button onClick={handleCreateMap} className=' bg-orange-600 text-white px-4 py-2 rounded-md'>Save</button>
                    <button onClick={handleAddForm} className=' bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center gap-2'><Plus size={15}/>Add more</button>
                    <Dialog>
                        <DialogTrigger>
                           
                            <button className=' bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center gap-2'><Eye size={15}/>Preview</button>
                        </DialogTrigger>
                        <DialogContent className=' w-[90%] h-full bg-zinc-900 border-none overflow-hidden'>
                        <div className=' w-full lg:h-screen h-auto flex flex-col items-center justify-center py-20'
                            style={{backgroundImage: "url('/stage/assets/BG.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                            >
                                <h2 className=' text-2xl md:text-4xl lg:text-5xl font-bold text-orange-400'>THE MAP</h2>

                                <div className='relative max-w-[1920px] w-[90%] lg:w-[85%] lg:h-[700px] h-auto grid grid-cols-1 lg:grid-cols-2 place-items-center gap-5'>
                                    <div className=' w-full flex flex-col'>
                                        <Carousel className=' w-full' setApi={setApi}>
                                            <CarouselContent>
                                                {formData.map((item, index) => (
                                                    <CarouselItem key={index} className=' w-full cursor-pointer'>
                                                     <div className=' relative flex flex-col gap-5 w-full md:h-[400px] h-[250px] rounded-xl p-6 text-white'
                                                         style={{backgroundImage: `url('${item.previewUrl}')`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                                     >
                                                     
                                                     </div>
 
                                                    </CarouselItem>
                                                ))}
                                               


                                                
                                            </CarouselContent>
                                    
                                        </Carousel>

                                     
                                    </div>

                                    <div className=' lg:block 2xl:w-[500px] 2xl:h-[500px] xl:w-[400px] xl:h-[400px] lg:w-[350px] lg:h-[350px] md:w-[95%] md:h-[650px] h-[250px] w-full lg:p-8 md:p-12 p-8 '
                                    style={{backgroundImage: "url('/stage/assets/Description Tab.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                    >
                                     
                                            <div className=' flex flex-col gap-4 lg:w-full h-full overflow-y-auto'>
                                                <p className=' text-2xl md:text-4xl font-bold text-orange-300'>{formData[current - 1]?.title}</p>
                                                <p className=' text-sm md:text-lg text-orange-100 whitespace-pre-wrap'>{formData[current - 1]?.content}</p>
                                            </div>
                                        
                                        
                                            
                                   
                                    </div>
                                    

                                   
                                </div>

                        </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

    </div>
    
    
    
  )
}