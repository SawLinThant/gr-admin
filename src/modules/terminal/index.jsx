import { useEffect, useState } from "react";
import CustomTable from "../common/components/custom-table";
import { terminalColumn } from "../common/components/custom-table/columns";
import CustomFilter from "../common/components/custom-filter";
import { useNavigate } from "react-router-dom";
import { useQuery,useLazyQuery } from "@apollo/client";
import { GET_TERMINAL_BY_STATUS, GET_TERMINALS } from "../../graphql/query/terminal-query";
import nProgress from "nprogress";
import { terminalFilterOptions } from "../../lib/config";

const TerminalList = () => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const [getTerminals,{
    data: terminalList,
    loading: fetchTerminalList,
    error: fetchTerminalError,
  }] = useLazyQuery(GET_TERMINALS,{
    pollInterval:500
  });

  console.log(filter)

  const [getTerminalsByStatus,{data:terminalListByStatus,loading:fetchTerminalListByStatus}] = useLazyQuery(GET_TERMINAL_BY_STATUS)
  const terminalLists = terminalList ? terminalList.terminals : [];
  console.log(terminalLists)

  const column = terminalColumn(navigate);
  
  useEffect(() => {
    if(filter === '' || filter === 'all'){
        getTerminals();
    }else if(filter === 'enable'){
       getTerminalsByStatus({
        variables:{disabled:false}
       })
    }
    else{
        getTerminalsByStatus({
            variables:{disabled:true}
           })
    }
  },[filter,getTerminals,getTerminalsByStatus])

  const tableData = filter === '' || filter === 'all' ?(terminalList? terminalList.terminals: []):(terminalListByStatus? terminalListByStatus.terminals:[])

  useEffect(() => {
    if (fetchTerminalList) {
      nProgress.configure({
        parent: "#progress-bar-container",
        showSpinner: false,
      });
      nProgress.start();
    } else {
        nProgress.done();
    }

    return () => {
        nProgress.done();
    };
  }, [fetchTerminalList, fetchTerminalError]);

  return (
    <div className="w-full flex flex-col gap-4 pr-5 pl-5">
      <div className="w-full h-20 flex flex-row items-center justify-between">
        {/* <div className="flex flex-row items-center gap-4">
          <input
            className="w-[15vw] p-2 rounded border border-purple-800"
            type="text"
          />
          <button className="border border-purple-800">Search</button>
        </div> */}
        <div className="flex flex-row items-center gap-8">
          <div className="">
            <CustomFilter setOptions={setFilter} option={terminalFilterOptions} />
          </div>
          <div className="h-12">
            <button
              className="bg-green-600 hover:border-green-500 text-white duration-500 hover:bg-green-400 hover:text-gray-800"
              onClick={() => navigate("terminallists/createterminal")}
            >
              New
            </button>
          </div>
        </div>
      </div>
      <CustomTable column={column} tableData={tableData} />
    </div>
  );
};
export default TerminalList;
