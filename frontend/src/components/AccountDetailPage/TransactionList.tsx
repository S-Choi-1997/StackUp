import { transactionInfo } from "../../apis/Account.type";
import Transaction from "./Transaction";

interface transactionListProp {
  transactionList: transactionInfo[];
}
const TransactionList = ({transactionList}: transactionListProp) => {
  return (
    <div className="mx-20">
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th>일시</th>
          <th>입금액</th>
          <th>출금액</th>
          <th>사용처</th>
          <th>잔액</th>
        </tr>
      </thead>
      {/* <Transaction date="2024-09-04" withdraw={10000} balance={300000} use="엔제리너스" /> */}

      {transactionList.map((transaction: transactionInfo) => (
        <Transaction {...transaction} />
      ))}
    </table>
  </div>
  )
}

export default TransactionList;