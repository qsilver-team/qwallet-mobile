import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@app/redux/store";
import { basicInfo, getHistory, getToken, transferStatus } from "@app/api/api";
import Toast from "react-native-toast-message";
import eventEmitter from "@app/api/eventEmitter";
import { setMarketcap, setRichlist, setTokens } from "@app/redux/appSlice";

export interface AccountDetailType {
  addresses: string[];
  numaddrs: number;
  subshash: string;
}

export interface UserDetailType {
  isAuthenticated: boolean;
  password: string;
  accountInfo: AccountDetailType;
}

interface AuthContextType {
  user: UserDetailType | null;
  balances: string[];
  tempPassword: string;
  currentAddress: string;
  allAddresses: string[];
  histories: TransactionItem[];
  login: (userDetails: UserDetailType) => void;
  logout: () => void;
  setTempPassword: React.Dispatch<React.SetStateAction<string>>;
  setBalances: React.Dispatch<React.SetStateAction<string[]>>;
}

type TransactionItem = [number, string, string, string];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<UserDetailType | null>(null);
  const [tempPassword, setTempPassword] = useState("");
  const [balances, setBalances] = useState<string[]>([]);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [allAddresses, setAllAddresses] = useState<string[]>([]);
  const [histories, setHistories] = useState<TransactionItem[]>([]);

  const login = (userDetails: UserDetailType | null) => {
    setUser(userDetails);
  };
  const logout = () => {
    // axios
    //   .post(`${}/api/logout`)
    //   .then((resp) => {
    //     console.log(resp.data);
    //     dispatch(setIsAuthenticated(true));
    //     login(null);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   })
    //   .finally(() => {});
  };

  useEffect(() => {
    basicInfo();
    eventEmitter.on("S2C/history", (res) => {
      if (res.data) {
        setHistories(res.data.changes[1].txids);
      } else {
        Toast.show({ type: "error", text1: res.data.value.display });
        setHistories([]);
      }
    });
    eventEmitter.on("S2C/tokens", (res) => {
      if (res.data.tokens) {
        dispatch(setTokens(res.data.tokens));
      } else {
        Toast.show({ type: "error", text1: "Error ocurred!" });
      }
    });
    eventEmitter.on("S2C/basic-info", (res) => {
      if (res.data) {
        res.data.balances.map((key: number, balance: string) => {
          if (key >= 0 && key < balances.length) {
            let tmp: string[] = [...balances];
            tmp[key] = balance;
            setBalances(tmp);
          }
        });
        dispatch(setTokens(res.data.tokens));
        dispatch(setRichlist(res.data.richlist));
        dispatch(setMarketcap(res.data.marketcap));
      } else {
        Toast.show({ type: "error", text1: res.data.value.display });
      }
    });
  }, []);

  useEffect(() => {
    if (currentAddress != "") {
      getHistory(currentAddress);
      getToken();
    }
  }, [currentAddress]);

  useEffect(() => {
    if (user?.accountInfo) {
      setCurrentAddress(user?.accountInfo.addresses[0]);
      setAllAddresses(user?.accountInfo.addresses);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        tempPassword,
        balances,
        currentAddress,
        allAddresses,
        histories,
        login,
        logout,
        setTempPassword,
        setBalances,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
