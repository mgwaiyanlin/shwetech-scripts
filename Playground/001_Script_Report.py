messages = "Hi, This is a message"
my_columns = ["Letter", "Number", "Color"]
my_data = [["Row -1", 1, "<span style='background:yellow;'>Yellow</span>"], ["Row-2", 2, "<span style='background:green;'>Green</span>"], ["Row-3", 3, "<span style='background:red;'>Red</span>"]]

my_report_summary = [
    {"value": "1000", "label": "IT Equipment", "datatype": "data"},
    {"value": "2000", "label": "Electrical Equipment", "datatype": "data"},
    {"value": "3000", "label": "Electrical Equipment", "datatype": "data"},
    {"value": "4000", "label": "Electrical Equipment", "datatype": "data"}
]



dataset1 = {"values": [3000, 2000, 6000, 1500]}
dataset2 = {"values": [1000, 2000, 4000, 4000]}

my_chart = {
    'data': {'labels': ['iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 13 mini'], 'datasets': [dataset1, dataset2]}, 
    'type':'line'
}


data = my_columns, my_data, messages, my_chart, my_report_summary

