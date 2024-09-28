"use client";

import { useEffect, useState } from "react";
import useLike from "@/hooks/useLike";

export default function TimeTable(props: {
    tweetId: number, handle: string, okTimes: {
        okTime: string | null;
        userHandle: string;
    }[], liked: boolean, 
    myOkTime: string,
    startI: number,
    endI: number,
    days: number,
    startDate: string
}) {
    const { handle, okTimes, tweetId, liked, myOkTime, startI, endI, days, startDate } = props;
    const [countTable, setCountTable] = useState(Array(1 * 24).fill(0));
    const [isHover, setIsHover] = useState(false);
    const { likeTweet, unlikeTweet } = useLike();
    const [myOkTimeStr, setMyOkTimeStr] = useState("-1");
    const [ maxCnt, setMaxCnt ] = useState(0);
    // let tmpDate = new Date();
    // const [days, setDays] = useState(0);
    // const [startI, setStartI] = useState(0);
    // const [endI, setEndI] = useState(0);
    
    useEffect(() => {
        const initCountTable = () => {
            let maxC = 0;
            const cntResult = Array(days * 24).fill(0);
            okTimes.forEach(okTime => {
                if (!okTime.okTime) {
                    return;
                }
                for (let i = 0; i < okTime.okTime.length; i++) {
                    cntResult[i] += parseInt(okTime.okTime[i]);
                    if(cntResult[i] > maxC) {
                        maxC = cntResult[i];
                    }
                }
            });
            setCountTable(cntResult);
            setMaxCnt(maxC);
        }
        if(!myOkTime || myOkTime==="") {
            setMyOkTimeStr("0".repeat(days * 24));
        }
        else {
            setMyOkTimeStr(myOkTime);
        }
        initCountTable();
    }, [okTimes.length, liked, myOkTime, days, okTimes]);

    const color = ['bg-green-50', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900', 'bg-zinc-400'];
    const gridCol = ['grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6', 'grid-cols-7', 'grid-cols-8', 'grid-cols-9']

    return (
        <div>
            <div className="flex w-fit">
                <div className="py-4 grid gap-2 w-fit grid-cols-1">
                    {[...Array(25).keys()].map (num=>(
                        <div className="text-slate-700 h-4" style={{fontSize: "10px"}} key={"time"+num.toString()}>{String(num).padStart(2, "0") + ":00"}</div>
                    ))}
                </div>
                <div className="px-4 w-fit" onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)}>
                    <div className={"grid gap-2 w-fit " + gridCol[days-1]}>
                        {[...Array(days).keys()].map (num=>(
                            <div className="text-slate-700" style={{fontSize: "11px"}} key={"date"+num.toString()}>{(new Date((new Date(startDate)).setDate((new Date(startDate)).getDate()+num))).toISOString().split('T')[0]}</div>
                        ))}
                        {countTable.map((hr, i) =>
                        (<>
                            <div id={i.toString()} className={((liked && isHover && myOkTimeStr[i] === "1") ? color[hr] + " border-rose-500" : (((i%days === 0 && i/days<startI) || (i%days===days-1 && (i+1)/days > endI)) ? color[9] : color[hr]) + " border-transparent") + " rounded-lg border-2 w-12 h-4" +((!liked || (i%days === 0 && i/days<startI) || (i%days===days-1 && (i+1)/days > endI)) ? "":" hover:cursor-pointer")} key={hr.toString() + "_" + i.toString()} onClick={(!liked || (i%days === 0 && i/days<startI) || (i%days===days-1 && (i+1)/days > endI)) ? ()=>{} : async () => {
                                const newOkTime = (myOkTimeStr[i] === "1") ? (myOkTimeStr.slice(0, i) + "0" + myOkTimeStr.slice(i + 1, myOkTimeStr.length)) : (myOkTimeStr.slice(0, i) + "1" + myOkTimeStr.slice(i + 1, myOkTimeStr.length));
                                await unlikeTweet({
                                    tweetId,
                                    userHandle: handle,
                                });
                                await likeTweet({
                                    tweetId,
                                    userHandle: handle,
                                    okTime: newOkTime
                                });
                                // updateMyOkTime();
                                // initCountTable();
                            }}></div>
                        </>
                        )
                        )}
                    </div>
                </div>  
            </div>
            
            
            <div className={"px-4 py-4 grid gap-1 w-fit " + gridCol[maxCnt+2]}>
                <div className="text-sm text-slate-700">0/0</div>
                {[...Array(maxCnt+1).keys()].map((num) => (
                    <div key={num} className={color[num]+" rounded-lg border-2 w-5 h-5"}></div>
                ))}
                <div className="text-sm text-slate-700">{maxCnt}/{maxCnt}</div>
            </div>
        </div>
        
    );
}
