
import { cloneElement, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { groupBy as rowGrouper } from 'lodash';
// import _ from 'lodash';
import DataGrid from 'react-data-grid';
import { SelectColumn, DataGridProps, } from 'react-data-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import Select from "react-select";
import 'Assets/scss/2.css';
import "Assets/scss/1.scss"
import { useNavigate, useLocation } from 'react-router-dom';
const _ = require('lodash');
const filterColumnClassName = 'filter-cell';
const nf = new Intl.NumberFormat('en-US');
const hightLight = `
.rdg-cell {
  border-left:1px solid black
}
`
const filterClassname = `
  inline-size: 100%;
  padding: 4px;
  font-size: 14px;
`;
// const rowGrouper = () => {

// }
function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}
const groupFormatter = ({
  groupKey,
  childRows,
  column,
  row,
  isExpanded,
  isCellSelected,
  toggleGroup
}) => {
  if (childRows.length <= 1) {
    if (isExpanded) {
      return <>{null}</>;
    }
    return <>{childRows[0][column.key]}</>
  }

}
const groupFormatter2 = ({
  childRows,
  column,
  isExpanded,
}) => {
  if (isExpanded) {
    return <>{null}</>;
  }
  const rowNotEmpty = childRows.filter(row => row[column.key] !== null);
  if (rowNotEmpty.length === 0) rowNotEmpty.push({ [column.key]: "" });
  return <>{rowNotEmpty[0][column.key]}</>
}
const groupFormatter3 = ({
  childRows,
  column,
  isExpanded,
}) => {
  if (isExpanded) {
    return <>{null}</>;
  }
  const rowNotEmpty = childRows.filter(row => row[column.key] !== null);
  if (rowNotEmpty.length === 0) rowNotEmpty.push({ [column.key]: "" });
  return <>{nf.format(parseFloat(rowNotEmpty[0][column.key]).toFixed(2))}</>
}
const formatterByNumber = ({ column, row }) => {
  // https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript
  Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

  if (!row[column.key]) {
    return <>{null}</>;
  }

  return <>{nf.format(parseFloat(row[column.key]).toFixed(2))}</>;
}

const groupFormatterGroupByNumber = ({ column, childRows }) => {
  // https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript
  Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

  return <>{nf.format(childRows.reduce((prev, row) => parseFloat(prev + row[column.key]).toFixed(2), 0))}</>;
}
function groupFormatterGroupBy({

  groupKey,
  childRows,
  column,
  isExpanded,
}) {
  if (childRows.length <= 1) {
    if (groupKey !== childRows[0][column.key]) {
      if (isExpanded) return <>{null}</>;

      return <>{childRows[0][column.key]}</>;
    }
  }

  if (groupKey !== childRows[0][column.key]) return <>{null}</>;

  return <>{childRows[0][column.key]} ({childRows.length})</>;
};

const FilterContext = createContext(undefined);

function inputStopPropagation(e) {
  // console.log(e)
  if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.stopPropagation();
    // document.querySelector("#root").click()
  }
}

function selectStopPropagation(e) {
  // if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
  e.stopPropagation();
  // document.querySelector("#root").click()
  // }
}

const TableItemAnalysis = (props) => {
  const { chooseQD, chooseQA, chooseDA, ChooseQD, ChooseQA, ChooseDA, projectId, arrDesigns, arrQuotations, arrActuals, newArrCate, getOptionCategory } = props
  const { optionCategory } = props;
  const [isFirst, setIsFirst] = useState(true);
  // console.log(optionCategory)
  const SelectQD = () => {
    ChooseQD(true)
  }
  const SelectQA = () => {
    ChooseQA(true)
  }
  const SelectDA = () => {
    ChooseDA(true)
  }

  let navigate = useNavigate()
  let Location = useLocation()
  // const [rows3, setRows3] = useState([])
  // const [rows4, setRows4] = useState([])
  // const [rows5, setRows5] = useState([])
  const [toggleShowHide, setToggleShowHide] = useState(false)
  const [toggleShowHideColumn, setToggleShowHideColumn] = useState(false)
  const [toggleExportToExcel, setToggleExportToExcel] = useState(false)
  const [showHideItemName, setShowHideItemName] = useState(false)
  const [showHideTaskName, setShowHideTaskName] = useState(false)
  const [chooseTaskName, setChooseTaskName] = useState(false)
  const [selectedOptionsCategory, setSelectedOptionsCategory] = useState(Location.state ?
    { value: Location.state.category, label: Location.state.category } :
    { value: '', label: '' });
  const [selectedOptionsItemCode, setSelectedOptionsItemCode] = useState({ value: "", label: "" })
  const [selectedOptionsItemName, setSelectedOptionsItemName] = useState({ value: "", label: "" })
  const [selectedOptionsTaskName, setSelectedOptionsTaskName] = useState({ value: "", label: "" })
  const optioneListCategory = [...newArrCate]
  const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
  const [filters, setFilters] = useState(Location.state ? {
    CATEGORY: Location.state.category,
    ITEM_CODE_1: '',
    ITEM_CODE_2: '',
    ITEM_NAME_1: '',
    ITEM_NAME_2: '',
    TASK_NAME_1: Location.state.taskName === 'ALL TASK' ? '' : Location.state.taskName,
    TASK_NAME_2: Location.state.taskName === 'ALL TASK' ? '' : Location.state.taskName,
    enabled: true
  } : {
    CATEGORY: '',
    ITEM_CODE_1: '',
    ITEM_CODE_2: '',
    ITEM_NAME_1: '',
    ITEM_NAME_2: '',
    TASK_NAME_1: '',
    TASK_NAME_2: '',
    enabled: true
  });

  setTimeout(() => {
    if (isFirst) {
      if (Location.state) {
      } else {
        if (newArrCate !== '') {
          setSelectedOptionsCategory({ value: newArrCate[0].value, label: newArrCate[0].label });
          setFilters({
            CATEGORY: newArrCate[0].value,
            ITEM_CODE_1: '',
            ITEM_CODE_2: '',
            ITEM_NAME_1: '',
            ITEM_NAME_2: '',
            TASK_NAME_1: '',
            TASK_NAME_2: '',
            enabled: true
          })
        }
      }
    }
    setIsFirst(false);
  });
  useEffect(() => {
    if (Location.state) {
      if (Location.state.table === 'AQ') {
        ChooseQA(true)
      }
      else if (Location.state.table === 'AD') {
        ChooseDA(true)
      } else {
        ChooseDA(true)
      }
    } else { }
  }, [Location.state]);
  let Q1Row3 = 0
  let Q2Row3 = 0
  let A1Row3 = 0
  let A2Row3 = 0
  let Q1Row4 = 0
  let Q2Row5 = 0
  let A1Row4 = 0
  let A2Row5 = 0
  let indexQty3 = 0
  let indexQty1 = 0

  // console.log(arrDesigns)
  const quotationAttributes = chooseQD === true || chooseQA === true ? arrQuotations.map(qt => qt.attributes) : arrDesigns.map(qt => qt.attributes)
  const designAttributes = chooseQA === true || chooseDA === true ? arrActuals.map(qt => qt.attributes) : arrDesigns.map(qt => qt.attributes)


  const quotationItemCodes = quotationAttributes.map((value) => { return { ITEM_CODE: value.ITEM_CODE } })
  const designItemCodes = designAttributes.map((value) => { return { ITEM_CODE: value.ITEM_CODE } })

  /////////////////////////////// multi array count
  const mergedQDItemCode = [].concat(_.uniqBy(quotationItemCodes, 'ITEM_CODE'), _.uniqBy(designItemCodes, 'ITEM_CODE'))
  // console.log('mergedQDItemCode', mergedQDItemCode.length, mergedQDItemCode);

  const countMergedUniqueQDItemCode = _.countBy(mergedQDItemCode, 'ITEM_CODE');
  // console.log('countMergedUniqueQDItemCode', countMergedUniqueQDItemCode);

  const sortedMergedUniqueQDItemCode = _.chain(countMergedUniqueQDItemCode)
    .map((count, ITEM_CODE) => { return { ITEM_CODE, count } })
    .sortBy('count')
    .reverse()
    .value();


  const sameItemCode = sortedMergedUniqueQDItemCode.filter((item) => ![null, '', '0'].includes(item.ITEM_CODE) && item.count > 1);
  const notSameItemCode = sortedMergedUniqueQDItemCode.filter((item) => [null, '', '0'].includes(item.ITEM_CODE) || item.count === 1);


  function filterByItemCodeAndSort(array, filterList, tableName, mapKeyStr) {
    let v = 0
    return filterList
      .map((value) => array
        .filter(item => item.ITEM_CODE === value.ITEM_CODE)
        .map((item) => _.mapKeys(item, (value, key) => {
          return key + mapKeyStr
        }
        ))
        .map(item => {
          item.table = tableName;
          item.id = v++
          return item;
        })
        .sort((a, b) => (a.TASK_NAME > b.TASK_NAME) - (a.TASK_NAME < b.TASK_NAME)))
      .filter((a) => a.length > 0)
      .sort((a, b) => (a[0].TASK_NAME > b[0].TASK_NAME) - (a[0].TASK_NAME < b[0].TASK_NAME))
  }

  const getSameItemCodeQAMerge = () => {
    const Obj1 = {
      TASK_NAME_1: '',
      ITEM_CODE_1: '',
      ITEM_NAME_1: '',
      DESCRIPTION_1: '',
      UNIT_1: '',
      QTY_1: null,
      UNIT_PRICE_USD_1: '',
      TOTAL_AMOUNT_USD_1: null,
    };

    const Obj2 = {
      TASK_NAME_3: '',
      ITEM_CODE_3: '',
      ITEM_NAME_3: '',
      DESCRIPTION_3: '',
      UNIT_3: '',
      QTY_3: null,
      UNIT_PRICE_USD_3: '',
      TOTAL_AMOUNT_USD_3: null,
    };
    let v = 0

    const group = sameItemCode
      .map((value) => {
        const quotation = quotationAttributes
          .filter((item) => item.ITEM_CODE === value.ITEM_CODE)
          .sort((a, b) => (a.TASK_NAME > b.TASK_NAME) - (a.TASK_NAME < b.TASK_NAME))
          .map((item) => _.mapKeys(item, (val, key) => `${key}_1`))
          .map(item => {
            item.id = v++
            return item;
          })

        const design = designAttributes
          .filter((item) => item.ITEM_CODE === value.ITEM_CODE)
          .sort((a, b) => (a.TASK_NAME > b.TASK_NAME) - (a.TASK_NAME < b.TASK_NAME))
          .map((item) => _.mapKeys(item, (val, key) => `${key}_3`))
          .map(item => {
            item.id = v++
            return item;
          })

        if (quotation.length >= design.length) {
          const result = _.map(quotation, (v, index) => _.assign({}, v, design[index] || Obj2));
          return result;
        }

        const result = _.map(design, (v, index) => {
          const newObj1 = Obj1;
          newObj1.ITEM_CODE_1 = quotation[0].ITEM_CODE_1;
          return _.assign({}, v, quotation[index] || newObj1);
        });

        return result;
      });

    const sameItemCodeFlatten = _.flatten(group);
    // console.log(sameItemCodeFlatten)
    return sameItemCodeFlatten;
  };

  const getNotSameItemCode1 = () => {
    const group = filterByItemCodeAndSort(quotationAttributes, notSameItemCode, "quotations", "_1")
    let getNotSameItemCode1Flatten = _.flatten(group);
    // setRows4(getNotSameItemCode1Flatten)
    return getNotSameItemCode1Flatten
    // fs.writeFileSync('./getNotSameItemCode1Flatten.json', JSON.stringify(getNotSameItemCode1Flatten, null, 4))
  }

  const getNotSameItemCode2 = () => {
    const group = filterByItemCodeAndSort(designAttributes, notSameItemCode, "designs", "_2");

    const notSameItemCode2Flatten = _.flatten(group);
    // setRows5(notSameItemCode2Flatten)
    return notSameItemCode2Flatten
    // fs.writeFileSync('./notSameItemCode2Flatten.json', JSON.stringify(notSameItemCode2Flatten, null, 4))
  }
  const rows3 = getSameItemCodeQAMerge()
  const rows4 = getNotSameItemCode1()
  const rows5 = getNotSameItemCode2()


  // console.log(filters)
  // console.log(optionCategory)

  useEffect(() => {
    getOptionCategory(filters)
  }, [filters]);

  const options = ['ITEM_CODE_1', 'ITEM_CODE_2']; //, 'DESCRIPTION_1', 'DESCRIPTION_2'];
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedOptions, setSelectedOptions] = useState([
    options[0],
    options[1],
    // options[2],
    // options[3]
  ]);

  const [expandedGroupIds, setExpandedGroupIds] = useState(
    () => new Set(['United States of America', 'United States of America__2015'])
  );
  const filteredRows5 = useMemo(() => {
    // console.log(rows3)
    const filterData = rows3.filter((r) => {
      // {console.log(filters.ITEM_NAME_1)}
      return (
        ((filters.ITEM_CODE_1 ? r.ITEM_CODE_1.includes(filters.ITEM_CODE_1) : true)) &&
        (filters.ITEM_NAME_1 ? r.ITEM_NAME_1.includes(filters.ITEM_NAME_1) : true) &&
        // (filters.TASK_NAME_1 !== 'All Task' ? r.TASK_NAME_1 === filters.TASK_NAME_1 : true) 
        ((filters.TASK_NAME_1 !== 'All Task' ? r.TASK_NAME_1.toLowerCase().startsWith(filters.TASK_NAME_1.toLowerCase()) : true)
          ||
          (filters.TASK_NAME_2 !== 'All Task' ? r.TASK_NAME_3.toLowerCase().startsWith(filters.TASK_NAME_2.toLowerCase()) : true))
      );
    });
    if (filters.TASK_NAME_1 === "All Task" || filters.TASK_NAME_1 === "") return filterData
    const newData = filterData.map((item) => {
      const newItem = item;
      if (item.TASK_NAME_1 !== filters.TASK_NAME_1) {
        newItem.ITEM_CODE_1 = newItem.ITEM_CODE_3;
        newItem.TASK_NAME_1 = '';
        newItem.ITEM_NAME_1 = '';
        newItem.DESCRIPTION_1 = newItem.DESCRIPTION_3;
        newItem.UNIT_1 = '';
        newItem.QTY_1 = null;
        newItem.UNIT_PRICE_USD_1 = '';
        newItem.TOTAL_AMOUNT_USD_1 = null;
      }

      if (item.TASK_NAME_3 !== filters.TASK_NAME_1) {
        newItem.ITEM_CODE_3 = '';
        newItem.TASK_NAME_3 = '';
        newItem.ITEM_NAME_3 = '';
        newItem.DESCRIPTION_3 = '';
        newItem.UNIT_3 = '';
        newItem.QTY_3 = null;
        newItem.UNIT_PRICE_USD_3 = '';
        newItem.TOTAL_AMOUNT_USD_3 = null;
      }

      return newItem;
    });

    // console.log(NewArr)
    const checkFilterSuccess = newData.filter((item) => !['', filters.TASK_NAME_1].includes(item.TASK_NAME_1) || !['', filters.TASK_NAME_1].includes(item.TASK_NAME_3));
    return newData
  }, [rows3, filters]);

  const filteredRows6 = useMemo(() => {
    return rows4.filter((r) => {
      // console.log(r.findIndex(i => i.ITEM_CODE_1 === filters.ITEM_CODE_1))
      return (
        (filters.ITEM_CODE_1 ? r.ITEM_CODE_1.includes(filters.ITEM_CODE_1) : true) &&
        (filters.ITEM_NAME_1 ? r.ITEM_NAME_1.includes(filters.ITEM_NAME_1) : true) &&
        (filters.TASK_NAME_1 !== 'All Task'
          ? r.TASK_NAME_1.toLowerCase().startsWith(filters.TASK_NAME_1.toLowerCase())
          : true)

      );
    });
  }, [rows4, filters]);

  const filteredRows7 = useMemo(() => {
    return rows5.filter((r) => {
      return (
        (filters.ITEM_CODE_2 ? r.ITEM_CODE_2.includes(filters.ITEM_CODE_2) : true) &&
        (filters.ITEM_NAME_2 ? r.ITEM_NAME_2.includes(filters.ITEM_NAME_2) : true) &&
        (filters.TASK_NAME_2 !== 'All Task'
          ? r.TASK_NAME_2.toLowerCase().startsWith(filters.TASK_NAME_2.toLowerCase())
          : true)
      );
    });
  }, [rows5, filters]);
  const taskNameOptions = useMemo(
    () =>
      Array.from(new Set(filteredRows5.map((r) => r.TASK_NAME_1))).map((d) => ({
        label: d,
        value: d
      })),
    [filteredRows5]
  );
  const taskNameOptions1 = useMemo(
    () =>
      Array.from(new Set(filteredRows6.map((r) => r.TASK_NAME_1))).map((d) => ({
        label: d,
        value: d
      })),
    [filteredRows6]
  );
  const taskNameOptions2 = useMemo(
    () =>
      Array.from(new Set(filteredRows7.map((r) => r.TASK_NAME_2))).map((d) => ({
        label: d,
        value: d
      })),
    [filteredRows7]
  );
  const itemNameOptions = useMemo(
    () =>
      Array.from(new Set(filteredRows5.map((r) => r.ITEM_NAME_1))).map((d) => ({
        label: d,
        value: d
      })),
    [filteredRows5]
  );
  const itemNameOptions1 = useMemo(
    () =>
      Array.from(new Set(filteredRows6.map((r) => r.ITEM_NAME_1))).map((d) => ({
        label: d,
        value: d
      })),
    [filteredRows6]
  );
  const itemNameOptions2 = useMemo(
    () =>
      Array.from(new Set(filteredRows7.map((r) => r.ITEM_NAME_2))).map((d) => ({
        label: d,
        value: d
      })),
    [filteredRows7]
  );
  const itemCodeOptions = useMemo(
    () =>
      Array.from(new Set(filteredRows5.map((r) => r.ITEM_CODE_1))).map((d) => ({
        label: d,
        value: d
      })),
    [filteredRows5]
  );
  const itemCodeOptions1 = useMemo(
    () =>
      Array.from(new Set(filteredRows6.map((r) => r.ITEM_CODE_1))).map((d) => ({
        label: d,
        value: d
      })),
    [filteredRows6]
  );
  const itemCodeOptions2 = useMemo(
    () =>
      Array.from(new Set(filteredRows7.map((r) => r.ITEM_CODE_2))).map((d) => ({
        label: d,
        value: d
      })),
    [filteredRows7]
  );


  let itemCodeOptionUnique = uniqueArray([...itemCodeOptions, ...itemCodeOptions1, ...itemCodeOptions2])
  let itemNameOptionUnique = uniqueArray([...itemNameOptions, ...itemNameOptions1, ...itemNameOptions2])
  let taskNameOptionUnique = uniqueArray([...taskNameOptions, ...taskNameOptions1, ...taskNameOptions2])
  for (let index = 0; index < filteredRows5.length; index++) {

    if (filteredRows5[index].QTY_3 !== null) {
      indexQty3 = indexQty3 + 1

    }
    if (filteredRows5[index].QTY_1 !== null) {
      indexQty1 = indexQty1 + 1
    }
    Q1Row3 += filteredRows5[index].QTY_1
    Q2Row3 += filteredRows5[index].QTY_3
    A1Row3 += filteredRows5[index].TOTAL_AMOUNT_USD_1
    A2Row3 += filteredRows5[index].TOTAL_AMOUNT_USD_3
  }
  for (let index = 0; index < filteredRows6.length; index++) {
    Q1Row4 += filteredRows6[index].QTY_1
    A1Row4 += filteredRows6[index].TOTAL_AMOUNT_USD_1
  }
  for (let index = 0; index < filteredRows7.length; index++) {
    Q2Row5 += filteredRows7[index].QTY_2
    A2Row5 += filteredRows7[index].TOTAL_AMOUNT_USD_2
  }
  function toggleOption(option, enabled) {
    const index = selectedOptions.indexOf(option);
    if (enabled) {
      if (index === -1) {
        setSelectedOptions((options) => [...options, option]);
        // setChooseTaskName(!chooseTaskName)
      }
    } else if (index !== -1) {
      setSelectedOptions((options) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        return newOptions;
      });
    }
    setExpandedGroupIds(new Set());
  }



  // console.log(Q1Row3)
  const summaryRows1 = useMemo(() => {
    const summaryRow = {
      TotalCount_R4: filteredRows6.length,
      Qty_R4: Q1Row4,
      Amount_R4: A1Row4,
      Qty_R5: Q2Row5,
      Amount_R5: A2Row5,
      Qty_1_R3: Q1Row3,
      Amount_1_R3: A1Row3,
      Qty_2_R3: Q2Row3,
      Amount_2_R3: A2Row3,
    };
    return [summaryRow];
  }, [filteredRows6]);
  const summaryRows2 = useMemo(() => {
    const summaryRow = {
      TotalCount_R5: filteredRows7.length,
      Qty_R5: Q2Row5,
      Amount_R5: A2Row5
    };
    return [summaryRow];
  }, [filteredRows7]);
  const columns = useMemo(() => {
    return [
      // SelectColumn,
      {
        key: 'ITEM_CODE_1',
        name: 'ITEM_CODE',
        width: 140,
        frozen: true,
        summaryFormatter({ row }) {
          return <strong>Total: {row.TotalCount_R4} items</strong>;
        },
        groupFormatter: groupFormatterGroupBy

      },
      showHideTaskName === true ?
        {
          key: 'TASK_NAME_1',
          name: 'TASK_NAME',
          width: -1,
          minWidth: 0,
          hidden: true,
          groupFormatter: groupFormatterGroupBy,
        }
        :
        {
          key: 'TASK_NAME_1',
          name: 'TASK_NAME',
          // width:100,
          groupFormatter,
        },
      showHideItemName === true ?
        {
          key: 'ITEM_NAME_1',
          name: 'ITEM_NAME',
          width: -1,
          minWidth: 0,
          hidden: true,
          groupFormatter: groupFormatter2,
        }
        :
        {
          key: 'ITEM_NAME_1',
          name: 'ITEM_NAME',
          // width:100,
          groupFormatter: groupFormatter2,

        },
      {
        key: 'DESCRIPTION_1',
        name: 'DESCRIPTION',
        // width:120,
        groupFormatter: groupFormatter2,
      },

      // null


      {
        key: 'UNIT_1',
        name: 'UNIT',
        // width:110,
        groupFormatter,
        summaryFormatter() {
          return <>{chooseQA === true || chooseQD === true ? "Quotations (2)" : "Designs (2)"}</>;
        }
      },
      {
        key: 'QTY_1',
        name: 'QTY',
        // width:120,
        formatter: formatterByNumber, 
        groupFormatter: groupFormatterGroupByNumber,
        summaryFormatter({ row }) {
          return <>{row.Qty_R4}</>;
        }
      },
      {
        key: 'UNIT_PRICE_USD_1',
        name: 'UNIT_PRICE_USD',
        formatter: formatterByNumber,
         groupFormatter: groupFormatter3,
        // width:110,
      }
      ,
      {
        key: 'TOTAL_AMOUNT_USD_1',
        name: 'TOTAL_AMOUNT_USD',
        // width:110,
        // formatter: formatterByNumber,
        groupFormatter: groupFormatterGroupByNumber,
        summaryFormatter({ row }) {
          return <span>{row.Amount_R4}</span>;
        }
      }
    ];
  }, [chooseQA, chooseQD, chooseDA, showHideItemName, showHideTaskName]);
  const columns1 = useMemo(() => {
    return [
      {
        key: 'ITEM_CODE_2',
        name: 'ITEM_CODE',
        width: 140,
        summaryFormatter({ row }) {
          return <strong>Total: {row.TotalCount_R5} items</strong>;
        },
        groupFormatter: groupFormatterGroupBy
      },

      showHideTaskName === true ?
        {
          key: 'TASK_NAME_2',
          name: 'TASK_NAME',
          width: -1,
          minWidth: 0,
          hidden: true,
          groupFormatter: groupFormatterGroupBy,
        }
        :
        {
          key: 'TASK_NAME_2',
          name: 'TASK_NAME',
          // width:105,
          groupFormatter: groupFormatterGroupBy,
        },
      showHideItemName === true ?
        {
          key: 'ITEM_NAME_2',
          name: 'ITEM_NAME',
          width: -1,
          minWidth: 0,
          hidden: true,
          groupFormatter: groupFormatter2,
        }
        :
        {
          key: 'ITEM_NAME_2',
          name: 'ITEM_NAME',
          // width:105,
          groupFormatter: groupFormatter2,

        },
      {
        key: 'DESCRIPTION_2',
        name: 'DESCRIPTION',
        // width:120,
        groupFormatter: groupFormatter2,
      },
      {
        key: 'UNIT_2',
        name: 'UNIT',
        // width:100,
        summaryFormatter() {
          return <>{chooseQA === true || chooseDA === true ? "Actuals (2)" : "Designs (2)"}</>;
        },
        groupFormatter,
      },
      {
        key: 'QTY_2',
        name: 'QTY',
        // width:114,
        formatter: formatterByNumber, groupFormatter: groupFormatterGroupByNumber,
        summaryFormatter({ row }) {
          return <>{row.Qty_R5}</>;
        },
        displayName: "nameDisplay"
      },
      {
        key: 'UNIT_PRICE_USD_2',
        name: 'UNIT_PRICE_USD',
        formatter: formatterByNumber, groupFormatter: groupFormatter3,
      }
      ,
      {
        key: 'TOTAL_AMOUNT_USD_2',
        name: 'TOTAL_AMOUNT_USD',
        formatter: formatterByNumber, groupFormatter: groupFormatterGroupByNumber,
        summaryFormatter({ row }) {
          return <>{row.Amount_R5}</>;
        }
      }
    ];
  }, [chooseQA, chooseQD, chooseDA, showHideItemName, showHideTaskName]);
  const handleSelectCategory = (data) => {
    setSelectedOptionsCategory(data);
    setFilters({ ...filters, CATEGORY: data.value })
  }
  const handleSelectItemCode = (data) => {
    setSelectedOptionsItemCode(data)
    setFilters({ ...filters, ITEM_CODE_1: data.value, ITEM_CODE_2: data.value })
  }
  const handleSelectItemName = (data) => {
    setSelectedOptionsItemName(data)
    setFilters({ ...filters, ITEM_NAME_1: data.value, ITEM_NAME_2: data.value })
  }
  const handleSelectTaskName = (data) => {
    setSelectedOptionsTaskName(data)
    setFilters({ ...filters, TASK_NAME_1: data.value, TASK_NAME_2: data.value })
  }

  const columns2 = useMemo(() => {
    return [
      {
        key: 'PROJECT_NUMBER',
        name: 'PROJECT_NUMBER',
        summaryFormatter() {
          return <strong>Total</strong>;
        },
        headerCellClass: filterColumnClassName,
        headerRenderer: (p) => (
          <FilterRenderer{...p}>
            {() => (
              <span>{projectId}</span>
            )}
          </FilterRenderer>
        ),

      },
      {
        key: 'Category',
        name: 'CATEGORY',
        headerCellClass: filterColumnClassName,
        headerRenderer: (p) => (
          <FilterRenderer{...p}>
            {({ filters, ...rest }) => (
              // <input
              //   {...rest}
              //   className={filterClassname}
              //   value={filters.CATEGORY}
              //   onChange={(e) =>
              //     setFilters({
              //       ...filters,
              //       CATEGORY: e.target.value
              //     })
              //   }
              //   onKeyDown={selectStopPropagation}
              //   list="CATEGORY"
              // >
              // </input>
              <>
                <Select
                  {...rest}
                  options={optioneListCategory}
                  placeholder="Select category"
                  value={selectedOptionsCategory}
                  onChange={handleSelectCategory}
                  menuPortalTarget={document.querySelector('body')}
                  className="abscs3"
                /></>
            )}
          </FilterRenderer>
        )
      },
      {
        key: 'ITEM_CODE_1',
        name: 'ITEM_CODE',
        headerCellClass: filterColumnClassName,
        headerRenderer: (p) => (
          <FilterRenderer{...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                className={filterClassname + "focus"}
                value={filters.ITEM_CODE_1}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    ITEM_CODE_1: e.target.value,
                    ITEM_CODE_2: e.target.value
                  })
                }
                onKeyDown={(e) => selectStopPropagation(e)}
                onClick={(e) => selectStopPropagation(e)}
                // onMou={(e) => (inputStopPropagation(e), selectStopPropagation(e))}
                // onblur={(e) => inputStopPropagation(e)}
                style={{ caretColor: "rgba(0,0,0,0)" }}
                autoComplete="off"
                list="ITEM_CODE"
              />
              // <>
              //   <Select
              //     {...rest}
              //     options={itemCodeOptionUnique}
              //     placeholder="Select item code"
              //     value={selectedOptionsItemCode}
              //     onChange={handleSelectItemCode}
              //     menuPortalTarget={document.querySelector('body')}
              //     className="abscs3"
              //   /></>
            )}
          </FilterRenderer>
        ),
        summaryFormatter() {
          return <strong>Total</strong>;
        },
      },
      {
        key: 'ITEM_NAME_1',
        name: 'ITEM_NAME',
        headerCellClass: filterColumnClassName,
        headerRenderer: (p) => (
          <FilterRenderer{...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                className={filterClassname}
                value={filters.ITEM_NAME_1}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    ITEM_NAME_1: e.target.value,
                    ITEM_NAME_2: e.target.value
                  })
                }
                onKeyDown={selectStopPropagation}
                style={{ caretColor: "rgba(0,0,0,0)" }}
                list="ITEM_NAME_1"
              >
              </input>
              // <>
              //   <Select
              //     {...rest}
              //     options={itemNameOptionUnique}
              //     placeholder="Select item name"
              //     value={selectedOptionsItemName}
              //     onChange={handleSelectItemName}
              //     menuPortalTarget={document.querySelector('body')}
              //     className="abscs3"
              //   /></>
            )}
          </FilterRenderer>
        )
      },
      {
        key: 'TASK_NAME_1',
        name: 'TASK_NAME',
        headerCellClass: filterColumnClassName,
        headerRenderer: (p) => (

          <FilterRenderer{...p}>
            {({ filters, ...rest }) => (

              <input
                {...rest}
                className={filterClassname}
                value={filters.TASK_NAME_1}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    TASK_NAME_1: e.target.value,
                    TASK_NAME_2: e.target.value
                  })
                }
                style={{ caretColor: "rgba(0,0,0,0)" }}
                onKeyDown={selectStopPropagation}
                list="TASK_NAME_1"
              >
              </input>
              // <>
              //   <Select
              //     {...rest}
              //     options={taskNameOptionUnique}
              //     placeholder="Select task name"
              //     value={selectedOptionsTaskName}
              //     onChange={handleSelectTaskName}
              //     menuPortalTarget={document.querySelector('body')}
              //     className="abscs3"
              //   /></>
            )}
          </FilterRenderer>
        )
      },
      {
        key: 'GAP_QTY',
        name: 'GAP (QTY)',
        headerCellClass: filterColumnClassName,
        headerRenderer: (p, row) => (
          <FilterRenderer{...p}>
            {({ filters, ...rest }) => (
              <span>{nf.format(roundToTwo((Q2Row3 + Q2Row5) - (Q1Row3 + Q1Row4)))}</span>
            )}
          </FilterRenderer>
        )
      },
      {
        key: 'GAP_Total_Amount',
        name: 'GAP (Total_Amount)',
        headerCellClass: filterColumnClassName,
        headerRenderer: (p, row) => (
          <FilterRenderer{...p}>
            {({ filters, ...rest }) => (
              <span>{nf.format(roundToTwo((A2Row3 + A2Row5) - (A1Row3 + A1Row4)))}</span>
            )}
          </FilterRenderer>
        )
      },
    ];
  }, [Q1Row3, Q2Row3, A2Row3, Q2Row5, Q1Row4, A2Row5, A1Row3, A1Row4, optioneListCategory, selectedOptionsCategory, itemCodeOptionUnique, itemNameOptionUnique, taskNameOptionUnique]);

  const columns2_1 = useMemo(() => {
    return [
      {
        key: 'TOTAL',
        name: 'Total: ' + nf.format(roundToTwo(indexQty1 + filteredRows6.length)) + " items",
        width: 140
      },
      showHideTaskName === true ?
        {
          key: '1',
          name: '',
          width: -1,
          minWidth: 0,
          hidden: true,
        }
        :
        {
          key: '1',
          name: '',
        },
      showHideItemName === true ?
        {
          key: '2',
          name: '',
          width: -1,
          minWidth: 0,
          hidden: true,
        }
        :
        {
          key: '2',
          name: '',
        },
      {
        key: '3',
        name: '',
      },
      {
        key: '4',
        name: chooseQA === true || chooseQD === true ? "Quotations" : "Designs",
      },
      {
        key: '5',
        name: nf.format(roundToTwo(Q1Row4 + Q1Row3)),
      },
      {
        key: '6',
        name: "",
      },
      {
        key: '7',
        name: nf.format(roundToTwo(A1Row4 + A1Row3)),
      },
      {
        key: '8',
        name: 'Total: ' + nf.format(roundToTwo((indexQty3 + filteredRows7.length))) + " items",
        width: 140
      },
      showHideTaskName === true ?
        {
          key: '9',
          name: '',
          width: -1,
          minWidth: 0,
          hidden: true,
        }
        :
        {
          key: '9',
          name: '',
        },
      showHideItemName === true ?
        {
          key: '10',
          name: '',
          width: -1,
          minWidth: 0,
          hidden: true,
        }
        :
        {
          key: '10',
          name: '',
        },
      {
        key: '11',
        name: '',
      },
      {
        key: '12',
        name: chooseQA === true || chooseDA === true ? "Actuals" : "Designs",
      },
      {
        key: '13',
        name: nf.format(roundToTwo(Q2Row3 + Q2Row5)),
      },
      {
        key: '14',
        name: '',
      },
      {
        key: '15',
        name: nf.format(roundToTwo(A2Row3 + A2Row5)),
      }
    ];
  }, [showHideTaskName, showHideItemName, indexQty3, filteredRows5.length, Q1Row3, Q2Row3, A2Row3, Q2Row5, Q1Row4, A2Row5, A1Row3, A1Row4, optioneListCategory, selectedOptionsCategory, itemCodeOptionUnique, itemNameOptionUnique, taskNameOptionUnique]);

  const summaryRows = useMemo(() => {
    const summaryRow = {
      TotalCount_R3: filteredRows5.length,
      Qty_1_R3: Q1Row3,
      Amount_1_R3: A1Row3,
      Qty_2_R3: Q2Row3,
      Amount_2_R3: A2Row3,
    };
    return [summaryRow];
  }, [filteredRows5]);
  // console.log(...summaryRows)
  const columns3 = useMemo(() => {
    // SelectColumn,
    return [
      showHideTaskName === true ?
        {
          key: 'TASK_NAME_1',
          name: 'TASK_NAME',
          width: -1,
          minWidth: 0,

          hidden: true,
          groupFormatter: groupFormatterGroupBy,
        }
        :
        {
          key: 'TASK_NAME_1',
          name: 'TASK_NAME',
          // width:110,
          groupFormatter: groupFormatterGroupBy,
        },
      {
        key: 'ITEM_CODE_1',
        name: 'ITEM_CODE',
        width: 140,
        frozen: true,
        summaryFormatter({ row }) {
          return <strong>Total: {row.TotalCount_R3} items</strong>;
        },
        groupFormatter: groupFormatterGroupBy,
      },
      showHideItemName === true ?
        {
          key: 'ITEM_NAME_1',
          name: 'ITEM_NAME',
          width: -1,
          minWidth: 0,
          hidden: true,
          groupFormatter: groupFormatter2,
        }
        :
        {
          key: 'ITEM_NAME_1',
          name: 'ITEM_NAME',
          resizable: true,
          // width:110,
          groupFormatter: groupFormatter2,
        },
      {
        key: 'DESCRIPTION_1',
        name: 'DESCRIPTION',
        // width:120,
        groupFormatter: groupFormatter2,
      },
      {
        key: 'UNIT_1',
        name: 'UNIT',
        // width:110,
        summaryFormatter() {
          return <>{chooseQD === true || chooseQA === true ? "Quotations (1)" : "Designs (1)"}</>;
        },
        groupFormatter,
      },
      {
        key: 'QTY_1',
        name: 'QTY',
        // width:120,
        groupFormatter: groupFormatterGroupByNumber
        ,
        summaryFormatter({ row }) {
          return <>{row.Qty_1_R3}</>;
        }
      },
      {
        key: 'UNIT_PRICE_USD_1',
        name: 'UNIT_PRICE_USD',
        // width:110,
        formatter: formatterByNumber, groupFormatter: groupFormatter3,
      },
      {
        key: 'TOTAL_AMOUNT_USD_1',
        name: 'TOTAL_AMOUNT_USD',
        // width:120,
        formatter: formatterByNumber,
        groupFormatter: groupFormatterGroupByNumber
        ,
        summaryFormatter({ row }) {
          return <>{row.Amount_1_R3}</>;
        }
      },
      {
        key: 'ITEM_CODE_3',
        name: 'ITEM_CODE',
        width: 140,
        groupFormatter,
      },
      showHideTaskName === true ?
        {
          key: 'TASK_NAME_3',
          name: 'TASK_NAME',
          width: -1,
          minWidth: 0,
          hidden: true,
          groupFormatter: groupFormatterGroupBy,
        }
        :
        {
          key: 'TASK_NAME_3',
          name: 'TASK_NAME',
          // width:110,
          groupFormatter: groupFormatterGroupBy,
        },
      showHideItemName === true ?
        {
          key: 'ITEM_NAME_3',
          name: 'ITEM_NAME',
          width: -1,
          minWidth: 0,
          hidden: true,
          groupFormatter: groupFormatter2,
        }
        :
        {
          key: 'ITEM_NAME_3',
          name: 'ITEM_NAME',
          // width:110,
          groupFormatter: groupFormatter2,
        },
      {
        key: 'DESCRIPTION_3',
        name: 'DESCRIPTION',
        // width:120,
        groupFormatter: groupFormatter2,
      },
      {
        key: 'UNIT_3',
        name: 'UNIT',
        // width:100,
        summaryFormatter() {
          return <>{chooseQA === true || chooseDA === true ? "Actuals (1)" : "Designs (1)"}</>;
        },
        groupFormatter,
      },
      {
        key: 'QTY_3',
        name: 'QTY',
        // width:114,
        formatter: formatterByNumber, groupFormatter: groupFormatterGroupByNumber,
        summaryFormatter({ row }) {
          return <>{row.Qty_2_R3}</>;
        }
      },
      {
        key: 'UNIT_PRICE_USD_3',
        name: 'UNIT_PRICE_USD',
        // width:100,
        formatter: formatterByNumber, groupFormatter: groupFormatter3,
      },
      {
        key: 'TOTAL_AMOUNT_USD_3',
        name: 'TOTAL_AMOUNT_USD',
        // width:114,
        formatter: formatterByNumber, groupFormatter: groupFormatterGroupByNumber,
        summaryFormatter({ row }) {
          return <>{row.Amount_2_R3}</>;
        }
      },]
  }, [chooseQD, chooseQA, chooseDA, showHideItemName, showHideTaskName]);



  function clearFilters() {
    setFilters({
      ...filters,
      ITEM_CODE_1: '',
      ITEM_CODE_2: '',
      ITEM_NAME_1: '',
      ITEM_NAME_2: '',
      TASK_NAME_1: '',
      TASK_NAME_2: '',
      enabled: true
    });
    setSelectedOptionsItemCode({ value: "", label: "" })
    setSelectedOptionsItemName({ value: "", label: "" })
    setSelectedOptionsTaskName({ value: "", label: "" })
  }

  function toggleFilters() {
    setFilters((filters) => ({
      ...filters,
      enabled: !filters.enabled
    }));
  }
  function rowKeyGetter(row) {
    return row.id;
  }


  const ToggleShowHide = () => {
    setToggleShowHide(!toggleShowHide)
    setToggleShowHideColumn(false)
    setToggleExportToExcel(false)
  }
  const ToggleShowHideColumn = () => {
    setToggleShowHideColumn(!toggleShowHideColumn)
    setToggleShowHide(false)
    setToggleExportToExcel(false)
  }
  const ToggleExportToExcel = () => {
    setToggleExportToExcel(!toggleExportToExcel)
    setToggleShowHideColumn(false)
    setToggleShowHide(false)
  }
  const ToggleShowHideItemName = () => {
    setShowHideItemName(!showHideItemName)
  }
  const ToggleShowHideTaskName = () => {
    setShowHideTaskName(!showHideTaskName)
  }
  async function exportToXlsx(
    gridElement,
    fileName
  ) {
    const [{ utils, writeFile }, { head, body, foot }] = await Promise.all([
      import('xlsx'),
      getGridContent(gridElement)
    ]);
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([...head, ...body, ...foot]);
    var wscols = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];

    ws['!cols'] = wscols;
    utils.book_append_sheet(wb, ws, projectId);
    writeFile(wb, fileName);
  }
  async function exportToXlsx2(
    gridElement,
    fileName
  ) {
    const [{ utils, writeFile }, { head, body, foot }] = await Promise.all([
      import('xlsx'),
      getGridContent(gridElement)
    ]);
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([...head, ...body, ...foot]);
    var wscols = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];

    ws['!cols'] = wscols;
    utils.book_append_sheet(wb, ws, projectId);
    writeFile(wb, fileName);
  }
  async function exportToXlsx1(
    gridElement,
    fileName
  ) {
    const [{ utils, writeFile }, { head, body, foot }] = await Promise.all([
      import('xlsx'),
      getGridContent(gridElement)
    ]);
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([...head, ...body, ...foot]);
    var wscols = [
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];

    ws['!cols'] = wscols;
    utils.book_append_sheet(wb, ws, projectId);
    writeFile(wb, fileName);
  }


  let uniqueArrTaskName = uniqueArray([...taskNameOptions, ...taskNameOptions1, ...taskNameOptions2])
  let uniqueArrItemName = uniqueArray([...itemNameOptions, ...itemNameOptions1, ...itemNameOptions2])
  async function getGridContent(gridElement) {
    const { renderToStaticMarkup } = await import('react-dom/server');
    const grid = document.createElement('div');
    grid.innerHTML = renderToStaticMarkup(
      cloneElement(gridElement, {
        enableVirtualization: false
      })
    );
    const head = [['PROJECT_NUMBER', 'CATEGORY', 'ITEM_CODE', 'ITEM_NAME', 'TASK_NAME'], [projectId, filters.CATEGORY, filters.ITEM_CODE_1, filters.ITEM_NAME_1, filters.TASK_NAME_1], [], ...getRows('.rdg-header-row'),]
    return {
      head,
      body: getRows('.rdg-row:not(.rdg-summary-row)'),
      foot: getRows('.rdg-summary-row')
    };

    function getRows(selector) {
      return Array.from(grid.querySelectorAll(selector)).map((gridRow) => {
        return Array.from(gridRow.querySelectorAll('.rdg-cell')).map(
          (gridCell) => gridCell.innerText
        );
      });
    }
  }

  return (
    <div className="rootClassname">
      <div className="row" style={{ marginLeft: "2rem", marginRight: "2rem" }}>
        <div className="col-12 col-sm-2 col-md-2 col-xl py-3">
          <button className="btn btn-outline-secondary" onClick={ToggleShowHide} style={{ width: "100px", marginRight: "10px" }}>{toggleShowHide === true ? "Group by" : "Group by"}</button>
          <button className="btn btn-outline-secondary" onClick={ToggleShowHideColumn} style={{ width: "100px", marginRight: "10px" }}>{toggleShowHideColumn === true ? "Columns" : "Columns"}</button>
          <button className="btn btn-outline-secondary" onClick={ToggleExportToExcel}>
            Export to Excel
          </button>
        </div>
        <div className="col-12 col-sm-2 col-md-2 col-xl py-3">
          <a onClick={SelectQA} className={chooseQA === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Quotation - Actual</a>
        </div>
        <div className="col-12 col-sm-2 col-md-2 col-xl py-3">
          <a onClick={SelectQD} className={chooseQD === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Quotation - Design</a>
        </div>
        <div className="col-12 col-sm-2 col-md-2 col-xl py-3">
          <a onClick={SelectDA} className={chooseDA === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Design - Actual</a>
        </div>
        <div className="col-12 col-sm-2 col-md-2 col-xl py-3" style={{ textAlign: "end" }}>

          <button className="btn btn-outline-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="toolbarClassname filter-cell" style={{ marginLeft: "2rem", marginRight: "2rem" }}>
        <div style={{ display: toggleShowHide === true ? 'flex' : 'none' }}>
          {options.map((option) => (
            <label key={option} style={{ marginRight: "20px" }}>
              {option}
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={(e) => toggleOption(option, e.target.checked)}
                style={{ width: "auto", marginLeft: '5px' }}
              />{' '}

            </label>
          ))}

        </div>
        <div className="row">
          <div style={{ display: toggleShowHideColumn === true ? 'flex' : "none" }}>
            <div style={{ marginRight: "20px" }}>
              <label htmlFor="ItemName"> ITEM NAME</label>
              {showHideItemName === true ?
                <input style={{ width: "auto", marginLeft: "5px", marginTop: "5px" }} type="checkbox" id="ItemName" onChange={ToggleShowHideItemName} />
                :
                <input style={{ width: "auto", marginLeft: "5px", marginTop: "5px" }} type="checkbox" id="ItemName" onChange={ToggleShowHideItemName} checked />
              }

            </div>
            <div style={{ marginRight: "20px" }}>
              <label htmlFor="TaskName"> TASK NAME</label>
              {showHideTaskName === true ?
                <input style={{ width: "auto", marginLeft: "5px" }} type="checkbox" id="TaskName" onChange={ToggleShowHideTaskName} />
                :
                <input style={{ width: "auto", marginLeft: "5px" }} type="checkbox" id="TaskName" onChange={ToggleShowHideTaskName} checked />
              }


            </div>
          </div>
        </div>
        <div className='row'>
          <div style={{ display: toggleExportToExcel === true ? 'flex' : "none" }}>
            <div>
              <ExportButton onExport={() => exportToXlsx1(<DataGrid
                columns={columns3}
                rows={filteredRows5}
                summaryRows={summaryRows}
                defaultColumnOptions={{
                  sortable: true,
                  resizable: true
                }}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                className="fill-grid"
              />, `${projectId} - ${chooseQD === true ? "Quotations (1) + Designs (1)" : ""}${chooseQA === true ? "Quotations (1) + Actuals (1)" : ""}${chooseDA === true ? "Designs (1) + Actuals (1)" : ""}.xlsx`)}>
                Export {chooseQD === true && "Quotations (1) + Designs (1)"}{chooseQA === true && "Quotations (1) + Actuals (1)"}{chooseDA === true && "Designs (1) + Actuals (1)"}
              </ExportButton>
            </div>
            <div>
              <ExportButton onExport={() => exportToXlsx(<DataGrid
                columns={columns}
                rows={filteredRows6}
                summaryRows={summaryRows1}
                defaultColumnOptions={{
                  sortable: true,
                  resizable: true
                }}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                className="fill-grid"
              />, `${projectId} - ${chooseQD === true ? "Quotations (2)" : ""}${chooseQA === true ? "Quotations (2)" : ""}${chooseDA === true ? "Designs (2)" : ""}.xlsx`)}>
                Export {chooseQD === true && "Quotations (2)"}{chooseQA === true && "Quotations (2)"}{chooseDA === true && "Designs (2)"}
              </ExportButton>
            </div>
            <div>
              <ExportButton onExport={() => exportToXlsx2(<DataGrid
                columns={columns1}
                rows={filteredRows7}
                summaryRows={summaryRows2}
                defaultColumnOptions={{
                  sortable: true,
                  resizable: true
                }}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                className="fill-grid"
              />, `${projectId} - ${chooseQD === true ? "Designs (2)" : ""}${chooseQA === true ? "Actuals (2)" : ""}${chooseDA === true ? "Actuals (2)" : ""}.xlsx`)}>
                Export {chooseQD === true && "Designs (2)"}{chooseQA === true && "Actuals (2)"}{chooseDA === true && "Actuals (2)"}
              </ExportButton>
            </div>
          </div>
        </div>
      </div>



      <div className="toolbarClassname" style={{ marginLeft: "2rem", marginRight: "2rem" }}>


      </div>
      {/* <div>
        <ExportButton onExport={() => exportToXlsx(<DataGrid
          columns={columns3}
          rows={filteredRows5}
          summaryRows={summaryRows}
          defaultColumnOptions={{
            sortable: true,
            resizable: true
          }}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          className="fill-grid"
        />, 'Table Same Item Code.xlsx')}>
          Export to Excel
        </ExportButton>
      </div> */}
      <FilterContext.Provider value={filters}>
        <DataGrid
          className={filters.enabled ? "filter-cell fill-grid" : "fill-grid"}
          columns={columns2}
          rows={1}
          headerRowHeight={filters.enabled ? 70 : undefined}
          rowKeyGetter={rowKeyGetter}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          rowGrouper={rowGrouper}
          expandedGroupIds={expandedGroupIds}
          onExpandedGroupIdsChange={setExpandedGroupIds}
          defaultColumnOptions={{ resizable: true }}
          style={{ marginLeft: "2rem", marginRight: "2rem", textAlign: 'center' }}
        />
      </FilterContext.Provider>


      <div>
        {filteredRows5.length >= 1 &&
          <div style={{ marginLeft: "2rem", marginRight: "2rem" }}>

            <FilterContext.Provider value={filters}>
              <DataGrid
                className={filters.enabled ? "filter-cell fill-grid footerset" : "fill-grid footerset"}
                // className={(columns3) => columns3.TASK_NAME_1.includes("TASK_NAME_1" ? "1" : "2")}
                columns={columns3}
                rows={filteredRows5}
                // summaryRows={summaryRows}
                rowKeyGetter={rowKeyGetter}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                groupBy={selectedOptions}
                rowGrouper={rowGrouper}
                expandedGroupIds={expandedGroupIds}
                onExpandedGroupIdsChange={setExpandedGroupIds}
                defaultColumnOptions={{ resizable: true }}
                style={{ textAlign: 'center' }}
              />
            </FilterContext.Provider>
          </div>
        }

        {filteredRows6.length >= 1 || filteredRows7.length >= 1 ?
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>

              <FilterContext.Provider value={filters}>
                <DataGrid
                  className={filters.enabled ? "filter-cell fill-grid headerset1" : "fill-grid headerset1"}
                  columns={columns}
                  rows={filteredRows6}
                  // headerRowHeight={0}
                  rowKeyGetter={rowKeyGetter}
                  selectedRows={selectedRows}
                  onSelectedRowsChange={setSelectedRows}
                  groupBy={selectedOptions}
                  rowGrouper={rowGrouper}
                  expandedGroupIds={expandedGroupIds}
                  onExpandedGroupIdsChange={setExpandedGroupIds}
                  defaultColumnOptions={{ resizable: true }}
                  style={{ marginLeft: "2rem", textAlign: 'center' }}
                />
              </FilterContext.Provider>
            </div>
            <div style={{ width: "50%" }}>

              <FilterContext.Provider value={filters}>
                <DataGrid
                  className={filters.enabled ? "filter-cell fill-grid headerset2" : "fill-grid headerset2"}
                  columns={columns1}
                  rows={filteredRows7}
                  // headerRowHeight={0}
                  rowKeyGetter={rowKeyGetter}
                  selectedRows={selectedRows}
                  onSelectedRowsChange={setSelectedRows}
                  groupBy={selectedOptions}
                  rowGrouper={rowGrouper}
                  expandedGroupIds={expandedGroupIds}
                  onExpandedGroupIdsChange={setExpandedGroupIds}
                  defaultColumnOptions={{ resizable: true }}
                  style={{ marginRight: "2rem", textAlign: 'center' }}
                />
              </FilterContext.Provider>
              <datalist id="TASK_NAME_1">
                {uniqueArrTaskName.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}

              </datalist>
              <datalist id="CATEGORY">
                {newArrCate.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}

              </datalist>
              <datalist id="ITEM_NAME_1">
                {uniqueArrItemName.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </datalist>
              <datalist id="ITEM_CODE">
                {itemCodeOptionUnique.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </datalist>
            </div>
          </div>
          :
          null
        }


      </div>
      <FilterContext.Provider value={filters}>
        <DataGrid
          className={filters.enabled ? "filter-cell fill-grid" : "fill-grid"}
          columns={columns2_1}
          rows={1}
          // rowKeyGetter={rowKeyGetter}
          // selectedRows={selectedRows}
          // onSelectedRowsChange={setSelectedRows}
          // rowGrouper={rowGrouper}
          // expandedGroupIds={expandedGroupIds}
          // onExpandedGroupIdsChange={setExpandedGroupIds}
          // defaultColumnOptions={{ resizable: true }}
          style={{ marginLeft: "2rem", marginRight: "2rem", textAlign: 'center' }}
        />
      </FilterContext.Provider>
    </div>
  );
}
function ExportButton({
  onExport,
  children
}) {
  const [exporting, setExporting] = useState(false);
  return (
    <button
      className="btn btn-outline-secondary"
      style={{ marginRight: "10px" }}
      disabled={exporting}
      onClick={async () => {
        setExporting(true);
        await onExport();
        setExporting(false);
      }}
    >
      {exporting ? 'Exporting' : children}
    </button>
  );
}

function FilterRenderer({
  isCellSelected,
  column,
  children
}) {
  const filters = useContext(FilterContext);
  const { ref, tabIndex } = useRef(isCellSelected);
  return (
    <>
      <div>{column.name}</div>
      {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>}
    </>
  );
}


export default TableItemAnalysis;