import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMarketcap, setTick, updateRichlist } from "@app/redux/appSlice";
import eventEmitter from "@app/api/eventEmitter";
import { useAuth } from "@app/context/AuthContext";

export const SocketCom: React.FC = () => {
  const dispatch = useDispatch();
  const { balances, setBalances } = useAuth();
  useEffect(() => {
    eventEmitter.on("S2C/live", (res) => {
      if (res.data.command == "CurrentTickInfo") {
        dispatch(setTick(res.data.tick));
      } else if (res.data.command == "EntityInfo") {
        // setBalances({ [res.data.address]: parseFloat(res.data.balance) });
        if (res.data.address)
          // setBalances((prev) => {
          //   return {
          //     ...prev,
          //     [res.data.address]: parseFloat(res.data.balance),
          //   };
          // });
        if (res.data.tokens) {
          res.data.tokens.map((item: [string, string]) => {
            // setTokenBalances((prev) => {
            //   return {
            //     ...prev,
            //     [item[0]]: { [res.data.address]: parseInt(item[1]) },
            //   };
            // });
          });
        }
      } else if (res.data.balances) {
        let tmp: string[] = [...balances];
        res.data.balances.map((itm: [number, string]) => {
          tmp[itm[0]] = itm[1];
        });
        setBalances(tmp);
      } else if (res.data.richlist) {
        dispatch(updateRichlist(res.data));
      } else if (res.data.marketcap) {
        dispatch(setMarketcap(res.data.marketcap));
      } else if (res.data.tokenprices) {
        dispatch(setMarketcap(res.data.tokenprices));
      }
    });
  }, []);

  return <></>;
};
