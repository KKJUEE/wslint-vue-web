export default {
	methodList: [{
		id: 2,  
	    label: "有关物质-供试品", 
		prop: "methodId",
		type: "normal",
	    children: [{
			id: 21,
			label: "物质名",
			prop: "name",
			type: "normal",
			value: "杂质A",
			children: []
		},{
			id: 22,
			label: "相对保留时间",
			prop: "time",
			type: "normal",
			value: "1天",
			children: []
		},{
			id: 23,
			label: "矫正因子",
			prop: "factor",
			type: "normal",
			value: "0.2",
			children: []
		},{
			id: 24,
			label: "阀值",
			prop: "sill",
			type: "normal",
			value: "0.8",
			children: []
		}],
		relations: [{
			id: 77,
			label: "平均值",
			prop: "relation",
			type: "normal",
			value: "ID387",
			children: []
		}],
		params: [{
			id: 22,
			label: "物质名",
			prop: "name",
			value: "cfg1",
			children: []
		},{
			id: 22,
			label: "相对保留时间",
			prop: "time",
			value: "cfg1",
			children: []
		},{
			id: 22,
			label: "矫正因子",
			prop: "factor",
			value: "cfg2",
			children: []
		},{
			id: 22,
			label: "阀值",
			prop: "sill",
			value: "cfg2",
			children: []
		},{
			id: 22,
			label: "相对保留时间校正",
			prop: "timeFactor",
			value: "cfg1",
			children: []
		}]
	}]
}