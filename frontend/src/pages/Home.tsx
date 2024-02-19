import { Component } from "solid-js";
import { checkAuthentication, logout } from "../components/RoutesGuardian";
import { useNavigate } from "@solidjs/router";
import { Menu, Telescope } from "lucide-solid";

const Home: Component = () => {
    const navigator = useNavigate();
    const username = localStorage.getItem("username");
    checkAuthentication(navigator);

    return (
        <div class="w-full h-screen bg-[#0D1821] relative">
            <div class="absolute right-5 top-2">
                <button>
                    <Menu color="#F0F4EF" width={30}/>
                </button>
            </div>
            <div class="w-full flex justify-center">
                <form method="post" class="w-2/6 mt-[200px] relative">
                    <input type="text"
                       placeholder="Type anything"
                       class="pl-5 py-2 w-full rounded-md text-xl outline-none hover:outline-none"/>
                    <Telescope width={48} height={30} class="absolute right-3 bottom-[7px]" color="#344966"/>
                </form>
            </div>
        </div>
    );
};

export default Home;
