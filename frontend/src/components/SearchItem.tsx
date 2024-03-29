import { Component, createSignal, useContext } from "solid-js";
import { TSearchProps } from "../types/SearchProps";
import { BookmarkPlus } from "lucide-solid";
import { api } from "../lib/axios";
import { createStore } from "solid-js/store";
import { UserContext, useUserContext } from "../contexts/userContext";
import toast from "solid-toast";

type TBookmark = {
    title:string,
    link:string|undefined|null,
    userId: string
}

const SearchItem: Component<TSearchProps> = ({title, displayLink, snippet, position, lastPosition}) => {
    const userConfig = useUserContext();
    const [showBookmark, setShowBookmark] = createSignal<boolean>(false);
    const [searchItemStore, setSearchItemStore] = createStore<TBookmark>({} as TBookmark);
    let linkRef:HTMLAnchorElement|undefined;
    let linkTitleRef:HTMLHeadingElement|undefined;
    const cachedSuccess = () => toast.success("Bookmark added!", {
        duration: 3000,
        position: "bottom-right",
    });
    const searchItemBorder = () => {
        if(position===0) {
            return "rounded-t-lg"
        } else if(position===lastPosition-1) {
            return "rounded-b-lg pb-4 mb-[50px]"
        } else {
            return;
        }
    }

    const addBookmark = async (e:Event) => {
        const { _id } = userConfig;
        setSearchItemStore({
            title: linkRef?.innerHTML,
            link: linkRef?.getAttribute("href"),
            userId: _id
        });
        try {
            await api.post("/new-bookmark", {
                title: searchItemStore.title,
                link: searchItemStore.link,
                userId: searchItemStore.userId
            }).then(() => cachedSuccess());
        } catch(err) {
            console.log(err);
            console.log("Failed to add to bookmarks");
        }
    }

    return (
        <div class={`bg-[#182938] border border-[#344966] ${searchItemBorder()} p-3 h-[120px] relative`}
            onMouseOver={() => setShowBookmark(true)} onMouseLeave={() => {
                setShowBookmark(false);
            }}>
            <div class="flex justify-start items-center">
                <h3 class="text-[#B4CDED] text-xl font-bold hover:underline decoration-1 decoration-[#B4CDED] flex justify-start items-center" ref={linkTitleRef}>
                    <a href={displayLink} target="_blank" ref={linkRef}>
                        {title}
                    </a>
                </h3>
                <div title="Add to favorites">
                    {showBookmark() &&
                        <BookmarkPlus class="cursor-pointer ml-3" color="#e9aa2b" onClick={addBookmark} width={22}/>
                    }
                </div>
            </div>
            <p class="text-[#F0F4EF] text-lg ml-8 py-2">{snippet}</p>
        </div>
    )
}

export default SearchItem;
