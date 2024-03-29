import { Component, For, createEffect, createSignal, createResource, Switch, Match, useContext } from "solid-js";
import toast, {Toaster} from "solid-toast";
import { useNavigate } from "@solidjs/router";
import { Telescope, Eraser, ChevronsUp, ChevronsDown, SlidersHorizontal, Loader } from "lucide-solid";
import { api } from "../lib/axios";
import HomeProfileMenu from "../components/HomeProfileMenu";
import SearchItem from "../components/SearchItem";
import data from "../data.json";
import { createStore } from "solid-js/store";
import "./style.css";
import PulseLoading from "../components/PulseLoading";
import SearchCustomizer from "../components/SearchCustomizer";
import { UserContextProvider } from "../contexts/userContext";

const Home: Component = () => {
    const navigator = useNavigate();
    const [searchItems, setSearchItems] = createStore<Object[]>([]);
    const [isCustomSearchExpanded, setIsCustomSearchExpanded] = createSignal<boolean>(false);
    const [routesToScrape, setRoutesToScrape] = createSignal<string[]>([]);
    const [firstRender, setFirstRender] = createSignal<boolean>(true);
    const [cleaningCacheState, setCleaningCacheState] = createSignal<boolean>(false);
    const [isScrapingLoading, setIsScrapingLoading] = createSignal<boolean>(false);
    const [scrapedData, setScrapedData] = createSignal([]);
    const cachedSuccess = () => toast.success("Cache cleaned!", {
        duration: 1700,
        position: "bottom-right",
    });

    let searchRef: HTMLInputElement|undefined;

    const fetchURIsContent = async () => {
        return await api.get("/scrape", {
            params: {
                scrapeOn: routesToScrape()
            }
        });
    };

    const handleSearch = async (event:Event) => {
        event.preventDefault();
        try {
            setIsScrapingLoading(true);
            /* const searchResponse = await api.get("/search", { */
            /*     params: { */
            /*         q: searchRef?.value */
            /*     } */
            /* }); */
            const {items:searchItems} = data;
            let encodedRoutes = searchItems.map((item:any) => encodeURIComponent(item.formattedUrl));
            setRoutesToScrape(encodedRoutes);
            await fetchURIsContent()
                .then((response) => {
                    setScrapedData(response?.data)
                    setIsScrapingLoading(false)
                });
            for(let i=0;i<scrapedData()?.length;++i) {
                console.log(JSON.parse(scrapedData()[i]))
            }
            setSearchItems(searchItems);
        } catch(err:any) {
            throw new Error(err.message);
        }
    };

    const clearCachedContent = async () => {
        try {
            setCleaningCacheState(true)
            await api.post("/clearCachedContent", {
                documentsId: [...Array(routesToScrape().length).keys()]
            }).then(() => {
                setCleaningCacheState(false);
                cachedSuccess()
            });
        } catch(err) {
            console.log("Error on cleaninn cache");
        }
    }

    return (
        <UserContextProvider>
            <div class="min-h-screen bg-[#0D1821] relative">
                <HomeProfileMenu />
                <div class="min-w-4/5 mx-auto flex flex-col justify-center items-center">
                    <div class="w-[45%]">
                        <form method="post" class="w-full mt-[200px] relative flex justify-between items-center" onSubmit={handleSearch}>
                            <input type="text" ref={searchRef}
                               placeholder="Type anything" class="pl-6 py-3 min-w-full rounded-md text-xl outline-none hover:outline-none border-3 border-[#cccbc8]"/>
                            <Telescope width={48} height={30} class="hover:cursor-pointer absolute right-2 z-20" color="#344966" onClick={handleSearch}/>
                        </form>
                        <div class="w-full relative mx-auto">
                            <div class="w-4/5 mt-[20px] rounded-sm inline-block">
                               <button class="p-2 cursor-pointer bg-slate-800 w-full rounded-t-sm flex justify-between hover:bg-slate-700 border-b-2 border-sky-200 search-customizer" onClick={() => setIsCustomSearchExpanded(prev => !prev)}>
                                   <p class="flex justify-start gap-x-3 items center text-[#B4CDED] ml-3">Customize your search<SlidersHorizontal width={18} color="#B4CDED"/></p>
                                    {!isCustomSearchExpanded() ? (
                                        <ChevronsDown color="#ffffff" class="cursor-pointer"/>
                                    ) : (
                                        <ChevronsUp color="#ffffff" class="cursor-pointer"/>
                                    )}
                               </button>
                                   <div class={`${isCustomSearchExpanded() ? "h-[320px] overflow-auto" : "h-0 overflow-hidden"} content bg-slate-800 w-full rounded-b-sm search-customizer`}>
                                        <SearchCustomizer />
                                   </div>
                            </div>
                            <button class="text-[#0D1821] bg-[#BFCC94] p-2 rounded-md w-[18%] absolute top-[20px] right-0 flex justify-center items-center gap-x-2 hover:bg-[#BFCC99]" onClick={clearCachedContent}>
                                {cleaningCacheState() && (
                                  <Loader class="animate-spin" width={16}/>  
                                )}
                                Clear cache
                                <Eraser width={18} color="#0d1821" strokeWidth={1.6}/>
                                <Toaster />
                            </button>
                        </div>
                    </div>
                    <div class="mt-10 rounded-lg w-[70%]">
                    {
                    isScrapingLoading() ?
                    <For each={Array(7)}>
                        {(number, i) => (<PulseLoading />)}
                    </For>:
                     (
                     <div>
                            {searchItems.length > 0 && (
                                <h2 class="text-[#ffffff] text-2xl mb-2">{searchItems.length} items displayed</h2>
                            )}
                                <For each={searchItems}>
                                    {(search:any, i) => (
                                            <SearchItem
                                                displayLink={search.link}
                                                snippet={search.snippet}
                                                title={search.title}
                                                position={i()}
                                                lastPosition={searchItems.length}
                                            />
                                    )}
                                </For>
                     </div>
                     )}
                    </div>
                </div>
            </div>
        </UserContextProvider>
    );
};

export default Home;
