import {useState,useEffect} from 'react';
import {copy,linkIcon,loader,tick} from '../assets'
import { useLazyGetSummaryQuery } from '../services/article';

export default function Demo() {
    const [article,setArticle]= useState({
        url:'',
        summary:'',
    })
    const [allArticles,setAllArticles]= useState([]);
    const [getSummary,{error,isFetching}]= useLazyGetSummaryQuery();
    const [copied,setCopied]=useState("");
    const handleSubmit= async(e)=>{
        // Fetch summary
        e.preventDefault();
        const {data}= await getSummary({articleUrl:article.url});
        if(data?.summary){
            const newArticle={...article,summary:data.summary}
            setArticle(newArticle);
            const updateAllArticles= [newArticle,...allArticles]
            setAllArticles(updateAllArticles)
            console.log(newArticle);
            localStorage.setItem('articles',JSON.stringify(updateAllArticles));
        }
    }

    function handleCopy(copyUrl){
        setCopied(copyUrl);
        navigator.clipboard.writeText(copyUrl);
        setTimeout(()=> setCopied(false),3000)
    }

    useEffect(()=>{
        const articlesFromLocalStorage= JSON.parse(
            localStorage.getItem('articles')
        )
        if(articlesFromLocalStorage){
            setAllArticles(articlesFromLocalStorage)
        }

    },[])

    console.log(error);
    console.log(isFetching)
  return (
    <section className='mt-16 w-full max-w-xl'>
        {/* searcg */}
        <div className="flex flex-col w-full max-w-xl">
            <form className='relative flex justify-center items-center' onSubmit={()=>{}}>
                <img
                    src={linkIcon}
                    alt="link_icon"
                    className="absolute left-0 my-2 ml-3 w-5"
                />
                <input
                    type="url"
                    placeholder="Enter a URL"
                    value={article.url}
                    onChange={(e)=>{
                        setArticle({...article,url:e.target.value})
                    }}
                    required
                    className="url_input peer"
                />
                <button
                    type="submit"
                    className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
                    onClick={handleSubmit}
                >
                    <p>↵</p>
                </button>
            </form>
            {/*Browser URL HISTORY  */}
            <div className='flex flex-col gap-1 max-h1-60 overflow-auto'>
                    {allArticles.map((item,index)=>(
                        <div
                            key={`link-${index}`}
                            onClick={()=>setArticle(item)}
                            className='link_card'
                        >
                            <div className="copy_btn" onClick={()=>handleCopy(item.url)}>
                                <img 
                                    src={copied===item.url?tick:copy} 
                                    alt="copy_icon" 
                                    className='w-[40%} h-[40%] object-contain' 
                                />
                            </div>
                            <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>{item.url}</p>
                        </div>
                    ))}
            </div>
        </div>
        {/* dISPLAY rESULTS */}
        <div className='my-10 max-w-full flex justify-center items-center'>
            {isFetching?(
                <img src={loader} alt="loader" className='w-20 h-20 object-contain' />
            ):error?(
                <p className="font-inter font-bold text-black text-center">
                    Well, that was not supposed to happen.
                    <br />
                    <span className='font-satoshi font-normal text-gray-700'>
                        {error?.data?.error}
                    </span>
                </p>
            ):(
                article.summary &&(
                    <div className='flex flex-col gap-3'>
                        <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                            Article <span className='blue_gradient'>Summary</span>
                        </h2>
                        <div className='summary_box'>
                            <p className="font-inter font-medium text-sm text-gray-700">
                                {article.summary}
                            </p>
                        </div>
                    </div>
                )
            )
            }
        </div>
    </section>
  )
}
