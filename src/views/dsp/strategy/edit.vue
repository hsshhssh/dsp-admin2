<template>
  <div class="app-container">
    <el-form ref="postForm" :model="temp" :rules="rules" label-position="right" label-width="120px">
      <el-form-item label="计划名称">
        <el-input v-model="temp.name"/>
      </el-form-item>
      <el-form-item label="广告位名称">
        <el-button type="primary" @click="handleSelectAd">选择广告位</el-button>
        <el-input v-model="temp.adplacementname" :disabled="true"/>
      </el-form-item>
      <el-form-item label="素材名称">
        <el-select v-model="temp.materialid" filterable placeholder="请选择" style="width: 200px">
          <el-option
            v-for="item in materialOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="曝光监测URL">
        <el-input v-model="temp.pmoUrl" />
      </el-form-item>
      <el-form-item label="点击监测URL">
        <el-input v-model="temp.cmoUrl" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="temp.price"/>
      </el-form-item>

      <el-form-item label="投放时间">
        <el-checkbox-group v-model="temp.hoursList">
          <el-checkbox label="1">01</el-checkbox>
          <el-checkbox label="2">02</el-checkbox>
          <el-checkbox label="3">03</el-checkbox>
          <el-checkbox label="4">04</el-checkbox>
          <el-checkbox label="5">05</el-checkbox>
          <el-checkbox label="6">06</el-checkbox>
          <el-checkbox label="7">07</el-checkbox>
          <el-checkbox label="8">08</el-checkbox>
          <el-checkbox label="9">09</el-checkbox>
          <el-checkbox label="10">10</el-checkbox>
          <el-checkbox label="11">11</el-checkbox>
          <el-checkbox label="12">12</el-checkbox>
          <el-checkbox label="13">13</el-checkbox>
          <el-checkbox label="14">14</el-checkbox>
          <el-checkbox label="15">15</el-checkbox>
          <el-checkbox label="16">16</el-checkbox>
          <el-checkbox label="17">17</el-checkbox>
          <el-checkbox label="18">18</el-checkbox>
          <el-checkbox label="19">19</el-checkbox>
          <el-checkbox label="20">20</el-checkbox>
          <el-checkbox label="21">21</el-checkbox>
          <el-checkbox label="22">22</el-checkbox>
          <el-checkbox label="23">23</el-checkbox>
          <el-checkbox label="24">24</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="投放地区">
        <!--<el-select v-model="temp.cityList" multiple filterable placeholder="请选择" style="width: 500px">-->
          <!--<el-option-->
            <!--v-for="item in cityOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <el-cascader style="width: 500px"
          v-model="temp.cityList"
          :options="cityOptions"
          :props="cityProps"
          filterable
          collapse-tags
          clearable></el-cascader>
      </el-form-item>

      <el-form-item label="网络状态">
        <el-checkbox-group v-model="temp.networkList">
          <el-checkbox label="0">无</el-checkbox>
          <el-checkbox label="1">WIFI</el-checkbox>
          <el-checkbox label="2">2/3/4G</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="自定义人群">
        <el-select v-model="temp.tagList" multiple filterable placeholder="请选择" style="width: 500px">
          <el-option
            v-for="item in tagOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="temp.materialname" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>


    <el-dialog title="选择广告位" :visible.sync="dialogSelectVisible">
      <div class="filter-container" style="margin-bottom: 20px">
        <el-input placeholder="广告位名称" v-model="adListQuery.adplacementname_like" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>

      <el-table
        v-loading="adListLoading"
        :key="adTableKey"
        :data="adList"
        border
        fit
        highlight-current-row
        style="width: 100%;">

        <el-table-column label="平台媒体" prop="id" sortable="custom" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.pmediaStr }}</span>
          </template>
        </el-table-column>

        <el-table-column label="广告位ID" prop="id" sortable="custom" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.adplacementid }}</span>
          </template>
        </el-table-column>

        <el-table-column label="广告位名称" prop="id" sortable="custom" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.adplacementname }}</span>
          </template>
        </el-table-column>

        <el-table-column label="媒体名称" prop="id" sortable="custom" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.medianame }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleSelectAdConfirm(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="adTotal>0" :total="adTotal" :page.sync="adListQuery.page" :limit.sync="adListQuery.limit" @pagination="getAdList" />
    </el-dialog>

  </div>
</template>

<script>
  import { getStrategy, saveStrategy } from '@/api/dsp/strategy'
  import { fetchListTag } from '@/api/dsp/tag'
  import { fetchListMaterial } from '@/api/dsp/material'
  import { fetchListAdplacement } from '@/api/dsp/adplacement'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {

    },
    data() {
      return {
        adTableKey: 0,
        adList:[],
        adListQuery: {
          limit: 5
        },
        adListLoading: false,
        adTotal: 5,
        dialogSelectVisible: false,
        cityProps: { multiple: true },
        cityOptions :
          [
            {value: "110000", label: "北京市"},
            {value: "120000", label: "天津市"},
            {
              value: "130000", label: "河北省", children: [
                {value: "130100", label: "石家庄市"},
                {value: "130200", label: "唐山市"},
                {value: "130300", label: "秦皇岛市"},
                {value: "130400", label: "邯郸市"},
                {value: "130500", label: "邢台市"},
                {value: "130600", label: "保定市"},
                {value: "130700", label: "张家口市"},
                {value: "130800", label: "承德市"},
                {value: "130900", label: "沧州市"},
                {value: "131000", label: "廊坊市"},
                {value: "131100", label: "衡水市"},
                {value: "139001", label: "定州市"},
                {value: "139002", label: "辛集市"}
              ]
            },
            {
              value: "140000", label: "山西省", children: [
                {value: "140100", label: "太原市"},
                {value: "140200", label: "大同市"},
                {value: "140300", label: "阳泉市"},
                {value: "140400", label: "长治市"},
                {value: "140500", label: "晋城市"},
                {value: "140600", label: "朔州市"},
                {value: "140700", label: "晋中市"},
                {value: "140800", label: "运城市"},
                {value: "140900", label: "忻州市"},
                {value: "141000", label: "临汾市"},
                {value: "141100", label: "吕梁市"}
              ]
            },
            {
              value: "150000", label: "内蒙古自治区", children: [
                {value: "150100", label: "呼和浩特市"},
                {value: "150200", label: "包头市"},
                {value: "150300", label: "乌海市"},
                {value: "150400", label: "赤峰市"},
                {value: "150500", label: "通辽市"},
                {value: "150600", label: "鄂尔多斯市"},
                {value: "150700", label: "呼伦贝尔市"},
                {value: "150800", label: "巴彦淖尔市"},
                {value: "150900", label: "乌兰察布市"},
                {value: "152200", label: "兴安盟"},
                {value: "152500", label: "锡林郭勒盟"},
                {value: "152900", label: "阿拉善盟"}
              ]
            },
            {
              value: "210000", label: "辽宁省", children: [
                {value: "210100", label: "沈阳市"},
                {value: "210200", label: "大连市"},
                {value: "210300", label: "鞍山市"},
                {value: "210400", label: "抚顺市"},
                {value: "210500", label: "本溪市"},
                {value: "210600", label: "丹东市"},
                {value: "210700", label: "锦州市"},
                {value: "210800", label: "营口市"},
                {value: "210900", label: "阜新市"},
                {value: "211000", label: "辽阳市"},
                {value: "211100", label: "盘锦市"},
                {value: "211200", label: "铁岭市"},
                {value: "211300", label: "朝阳市"},
                {value: "211400", label: "葫芦岛市"}
              ]
            },
            {
              value: "220000", label: "吉林省", children: [
                {value: "220100", label: "长春市"},
                {value: "220200", label: "吉林市"},
                {value: "220300", label: "四平市"},
                {value: "220400", label: "辽源市"},
                {value: "220500", label: "通化市"},
                {value: "220600", label: "白山市"},
                {value: "220700", label: "松原市"},
                {value: "220800", label: "白城市"},
                {value: "222400", label: "延边朝鲜族自治州"}
              ]
            },
            {
              value: "230000", label: "黑龙江省", children: [
                {value: "230100", label: "哈尔滨市"},
                {value: "230200", label: "齐齐哈尔市"},
                {value: "230300", label: "鸡西市"},
                {value: "230400", label: "鹤岗市"},
                {value: "230500", label: "双鸭山市"},
                {value: "230600", label: "大庆市"},
                {value: "230700", label: "伊春市"},
                {value: "230800", label: "佳木斯市"},
                {value: "230900", label: "七台河市"},
                {value: "231000", label: "牡丹江市"},
                {value: "231100", label: "黑河市"},
                {value: "231200", label: "绥化市"},
                {value: "232700", label: "大兴安岭地区"}
              ]
            },
            {value: "310000", label: "上海市"},
            {
              value: "320000", label: "江苏省", children: [
                {value: "320100", label: "南京市"},
                {value: "320200", label: "无锡市"},
                {value: "320300", label: "徐州市"},
                {value: "320400", label: "常州市"},
                {value: "320500", label: "苏州市"},
                {value: "320600", label: "南通市"},
                {value: "320700", label: "连云港市"},
                {value: "320800", label: "淮安市"},
                {value: "320900", label: "盐城市"},
                {value: "321000", label: "扬州市"},
                {value: "321100", label: "镇江市"},
                {value: "321200", label: "泰州市"},
                {value: "321300", label: "宿迁市"}
              ]
            },
            {
              value: "330000", label: "浙江省", children: [
                {value: "330100", label: "杭州市"},
                {value: "330200", label: "宁波市"},
                {value: "330300", label: "温州市"},
                {value: "330400", label: "嘉兴市"},
                {value: "330500", label: "湖州市"},
                {value: "330600", label: "绍兴市"},
                {value: "330700", label: "金华市"},
                {value: "330800", label: "衢州市"},
                {value: "330900", label: "舟山市"},
                {value: "331000", label: "台州市"},
                {value: "331100", label: "丽水市"}

              ]
            },
            {
              value: "340000", label: "安徽省", children: [
                {value: "340100", label: "合肥市"},
                {value: "340200", label: "芜湖市"},
                {value: "340300", label: "蚌埠市"},
                {value: "340400", label: "淮南市"},
                {value: "340500", label: "马鞍山市"},
                {value: "340600", label: "淮北市"},
                {value: "340700", label: "铜陵市"},
                {value: "340800", label: "安庆市"},
                {value: "341000", label: "黄山市"},
                {value: "341100", label: "滁州市"},
                {value: "341200", label: "阜阳市"},
                {value: "341300", label: "宿州市"},
                {value: "341500", label: "六安市"},
                {value: "341600", label: "亳州市"},
                {value: "341700", label: "池州市"},
                {value: "341800", label: "宣城市"}
              ]
            },
            {
              value: "350000", label: "福建省", children: [
                {value: "350100", label: "福州市"},
                {value: "350200", label: "厦门市"},
                {value: "350300", label: "莆田市"},
                {value: "350400", label: "三明市"},
                {value: "350500", label: "泉州市"},
                {value: "350600", label: "漳州市"},
                {value: "350700", label: "南平市"},
                {value: "350800", label: "龙岩市"},
                {value: "350900", label: "宁德市"}
              ]
            },
            {
              value: "360000", label: "江西省", children: [
                {value: "360100", label: "南昌市"},
                {value: "360200", label: "景德镇市"},
                {value: "360300", label: "萍乡市"},
                {value: "360400", label: "九江市"},
                {value: "360500", label: "新余市"},
                {value: "360600", label: "鹰潭市"},
                {value: "360700", label: "赣州市"},
                {value: "360800", label: "吉安市"},
                {value: "360900", label: "宜春市"},
                {value: "361000", label: "抚州市"},
                {value: "361100", label: "上饶市"}
              ]
            },
            {
              value: "370000", label: "山东省", children: [
                {value: "370100", label: "济南市"},
                {value: "370200", label: "青岛市"},
                {value: "370300", label: "淄博市"},
                {value: "370400", label: "枣庄市"},
                {value: "370500", label: "东营市"},
                {value: "370600", label: "烟台市"},
                {value: "370700", label: "潍坊市"},
                {value: "370800", label: "济宁市"},
                {value: "370900", label: "泰安市"},
                {value: "371000", label: "威海市"},
                {value: "371100", label: "日照市"},
                {value: "371200", label: "莱芜市"},
                {value: "371300", label: "临沂市"},
                {value: "371400", label: "德州市"},
                {value: "371500", label: "聊城市"},
                {value: "371600", label: "滨州市"},
                {value: "371700", label: "菏泽市"}
              ]
            },
            {
              value: "410000", label: "河南省", children: [
                {value: "410100", label: "郑州市"},
                {value: "410200", label: "开封市"},
                {value: "410300", label: "洛阳市"},
                {value: "410400", label: "平顶山市"},
                {value: "410500", label: "安阳市"},
                {value: "410600", label: "鹤壁市"},
                {value: "410700", label: "新乡市"},
                {value: "410800", label: "焦作市"},
                {value: "410900", label: "濮阳市"},
                {value: "411000", label: "许昌市"},
                {value: "411100", label: "漯河市"},
                {value: "411200", label: "三门峡市"},
                {value: "411300", label: "南阳市"},
                {value: "411400", label: "商丘市"},
                {value: "411500", label: "信阳市"},
                {value: "411600", label: "周口市"},
                {value: "411700", label: "驻马店市"},
                {value: "419001", label: "济源市"}
              ]
            },
            {
              value: "420000", label: "湖北省", children: [
                {value: "420100", label: "武汉市"},
                {value: "420200", label: "黄石市"},
                {value: "420300", label: "十堰市"},
                {value: "420500", label: "宜昌市"},
                {value: "420600", label: "襄阳市"},
                {value: "420700", label: "鄂州市"},
                {value: "420800", label: "荆门市"},
                {value: "420900", label: "孝感市"},
                {value: "421000", label: "荆州市"},
                {value: "421100", label: "黄冈市"},
                {value: "421200", label: "咸宁市"},
                {value: "421300", label: "随州市"},
                {value: "422800", label: "恩施土家族苗族自治州"},
                {value: "429004", label: "仙桃市"},
                {value: "429005", label: "潜江市"},
                {value: "429006", label: "天门市"},
                {value: "429021", label: "神农架林区"}
              ]
            },
            {
              value: "430000", label: "湖南省", children: [
                {value: "430100", label: "长沙市"},
                {value: "430200", label: "株洲市"},
                {value: "430300", label: "湘潭市"},
                {value: "430400", label: "衡阳市"},
                {value: "430500", label: "邵阳市"},
                {value: "430600", label: "岳阳市"},
                {value: "430700", label: "常德市"},
                {value: "430800", label: "张家界市"},
                {value: "430900", label: "益阳市"},
                {value: "431000", label: "郴州市"},
                {value: "431100", label: "永州市"},
                {value: "431200", label: "怀化市"},
                {value: "431300", label: "娄底市"},
                {value: "433100", label: "湘西土家族苗族自治州"}
              ]
            },
            {
              value: "440000", label: "广东省", children: [
                {value: "440100", label: "广州市"},
                {value: "440200", label: "韶关市"},
                {value: "440300", label: "深圳市"},
                {value: "440400", label: "珠海市"},
                {value: "440500", label: "汕头市"},
                {value: "440600", label: "佛山市"},
                {value: "440700", label: "江门市"},
                {value: "440800", label: "湛江市"},
                {value: "440900", label: "茂名市"},
                {value: "441200", label: "肇庆市"},
                {value: "441300", label: "惠州市"},
                {value: "441400", label: "梅州市"},
                {value: "441500", label: "汕尾市"},
                {value: "441600", label: "河源市"},
                {value: "441700", label: "阳江市"},
                {value: "441800", label: "清远市"},
                {value: "441900", label: "东莞市"},
                {value: "442000", label: "中山市"},
                {value: "445100", label: "潮州市"},
                {value: "445200", label: "揭阳市"},
                {value: "445300", label: "云浮市"}
              ]
            },
            {
              value: "450000", label: "广西壮族自治区", children: [
                {value: "450100", label: "南宁市"},
                {value: "450200", label: "柳州市"},
                {value: "450300", label: "桂林市"},
                {value: "450400", label: "梧州市"},
                {value: "450500", label: "北海市"},
                {value: "450600", label: "防城港市"},
                {value: "450700", label: "钦州市"},
                {value: "450800", label: "贵港市"},
                {value: "450900", label: "玉林市"},
                {value: "451000", label: "百色市"},
                {value: "451100", label: "贺州市"},
                {value: "451200", label: "河池市"},
                {value: "451300", label: "来宾市"},
                {value: "451400", label: "崇左市"}
              ]
            },
            {
              value: "460000", label: "海南省", children: [
                {value: "460100", label: "海口市"},
                {value: "460200", label: "三亚市"},
                {value: "460300", label: "三沙市"},
                {value: "460400", label: "儋州市"},
                {value: "469001", label: "五指山市"},
                {value: "469002", label: "琼海市"},
                {value: "469005", label: "文昌市"},
                {value: "469006", label: "万宁市"},
                {value: "469007", label: "东方市"},
                {value: "469021", label: "定安县"},
                {value: "469022", label: "屯昌县"},
                {value: "469023", label: "澄迈县"},
                {value: "469024", label: "临高县"},
                {value: "469025", label: "白沙黎族自治县"},
                {value: "469026", label: "昌江黎族自治县"},
                {value: "469027", label: "乐东黎族自治县"},
                {value: "469028", label: "陵水黎族自治县"},
                {value: "469029", label: "保亭黎族苗族自治县"},
                {value: "469030", label: "琼中黎族苗族自治县"}
              ]
            },
            {value: "500000", label: "重庆市"},
            {
              value: "510000", label: "四川省", children: [
                {value: "510100", label: "成都市"},
                {value: "510300", label: "自贡市"},
                {value: "510400", label: "攀枝花市"},
                {value: "510500", label: "泸州市"},
                {value: "510600", label: "德阳市"},
                {value: "510700", label: "绵阳市"},
                {value: "510800", label: "广元市"},
                {value: "510900", label: "遂宁市"},
                {value: "511000", label: "内江市"},
                {value: "511100", label: "乐山市"},
                {value: "511300", label: "南充市"},
                {value: "511400", label: "眉山市"},
                {value: "511500", label: "宜宾市"},
                {value: "511600", label: "广安市"},
                {value: "511700", label: "达州市"},
                {value: "511800", label: "雅安市"},
                {value: "511900", label: "巴中市"},
                {value: "512000", label: "资阳市"},
                {value: "513200", label: "阿坝藏族羌族自治州"},
                {value: "513300", label: "甘孜藏族自治州"},
                {value: "513400", label: "凉山彝族自治州"}
              ]
            },
            {
              value: "520000", label: "贵州省", children: [
                {value: "520100", label: "贵阳市"},
                {value: "520200", label: "六盘水市"},
                {value: "520300", label: "遵义市"},
                {value: "520400", label: "安顺市"},
                {value: "520500", label: "毕节市"},
                {value: "520600", label: "铜仁市"},
                {value: "522300", label: "黔西南布依族苗族自治州"},
                {value: "522600", label: "黔东南苗族侗族自治州"},
                {value: "522700", label: "黔南布依族苗族自治州"}
              ]
            },
            {
              value: "530000", label: "云南省", children: [
                {value: "530100", label: "昆明市"},
                {value: "530300", label: "曲靖市"},
                {value: "530400", label: "玉溪市"},
                {value: "530500", label: "保山市"},
                {value: "530600", label: "昭通市"},
                {value: "530700", label: "丽江市"},
                {value: "530800", label: "普洱市"},
                {value: "530900", label: "临沧市"},
                {value: "532300", label: "楚雄彝族自治州"},
                {value: "532500", label: "红河哈尼族彝族自治州"},
                {value: "532600", label: "文山壮族苗族自治州"},
                {value: "532800", label: "西双版纳傣族自治州"},
                {value: "532900", label: "大理白族自治州"},
                {value: "533100", label: "德宏傣族景颇族自治州"},
                {value: "533300", label: "怒江傈僳族自治州"},
                {value: "533400", label: "迪庆藏族自治州"}
              ]
            },
            {
              value: "540000", label: "西藏自治区", children: [
                {value: "540100", label: "拉萨市"},
                {value: "540200", label: "日喀则市"},
                {value: "540300", label: "昌都市"},
                {value: "540400", label: "林芝市"},
                {value: "540500", label: "山南市"},
                {value: "542400", label: "那曲地区"},
                {value: "542500", label: "阿里地区"}
              ]
            },
            {
              value: "610000", label: "陕西省", children: [
                {value: "610100", label: "西安市"},
                {value: "610200", label: "铜川市"},
                {value: "610300", label: "宝鸡市"},
                {value: "610400", label: "咸阳市"},
                {value: "610500", label: "渭南市"},
                {value: "610600", label: "延安市"},
                {value: "610700", label: "汉中市"},
                {value: "610800", label: "榆林市"},
                {value: "610900", label: "安康市"},
                {value: "611000", label: "商洛市"}
              ]
            },
            {
              value: "620000", label: "甘肃省", children: [
                {value: "620100", label: "兰州市"},
                {value: "620200", label: "嘉峪关市"},
                {value: "620300", label: "金昌市"},
                {value: "620400", label: "白银市"},
                {value: "620500", label: "天水市"},
                {value: "620600", label: "武威市"},
                {value: "620700", label: "张掖市"},
                {value: "620800", label: "平凉市"},
                {value: "620900", label: "酒泉市"},
                {value: "621000", label: "庆阳市"},
                {value: "621100", label: "定西市"},
                {value: "621200", label: "陇南市"},
                {value: "622900", label: "临夏回族自治州"},
                {value: "623000", label: "甘南藏族自治州"}
              ]
            },
            {
              value: "630000", label: "青海省", children: [
                {value: "630100", label: "西宁市"},
                {value: "630200", label: "海东市"},
                {value: "632200", label: "海北藏族自治州"},
                {value: "632300", label: "黄南藏族自治州"},
                {value: "632500", label: "海南藏族自治州"},
                {value: "632600", label: "果洛藏族自治州"},
                {value: "632700", label: "玉树藏族自治州"},
                {value: "632800", label: "海西蒙古族藏族自治州"}
              ]
            },
            {
              value: "640000", label: "宁夏回族自治区", children: [
                {value: "640100", label: "银川市"},
                {value: "640200", label: "石嘴山市"},
                {value: "640300", label: "吴忠市"},
                {value: "640400", label: "固原市"},
                {value: "640500", label: "中卫市"}
              ]
            },
            {
              value: "650000", label: "新疆维吾尔自治区", children: [
                {value: "650100", label: "乌鲁木齐市"},
                {value: "650200", label: "克拉玛依市"},
                {value: "650400", label: "吐鲁番市"},
                {value: "650500", label: "哈密市"},
                {value: "652300", label: "昌吉回族自治州"},
                {value: "652700", label: "博尔塔拉蒙古自治州"},
                {value: "652800", label: "巴音郭楞蒙古自治州"},
                {value: "652900", label: "阿克苏地区"},
                {value: "653000", label: "克孜勒苏柯尔克孜自治州"},
                {value: "653100", label: "喀什地区"},
                {value: "653200", label: "和田地区"},
                {value: "654000", label: "伊犁哈萨克自治州"},
                {value: "654200", label: "塔城地区"},
                {value: "654300", label: "阿勒泰地区"},
                {value: "659001", label: "石河子市"},
                {value: "659002", label: "阿拉尔市"},
                {value: "659003", label: "图木舒克市"},
                {value: "659004", label: "五家渠市"},
                {value: "659006", label: "铁门关市"}
              ]
            },
            {
              value: "710000", label: "台湾省", children: [
                {value: "710101", label: "金门"},
                {value: "710102", label: "连江"},
                {value: "710103", label: "苗栗"},
                {value: "710104", label: "南投"},
                {value: "710105", label: "澎湖"},
                {value: "710106", label: "屏东"},
                {value: "710107", label: "台东"},
                {value: "710108", label: "台中"},
                {value: "710109", label: "台南"},
                {value: "710110", label: "台北"},
                {value: "710111", label: "桃园"},
                {value: "710112", label: "云林"},
                {value: "710113", label: "新北"},
                {value: "710114", label: "彰化"},
                {value: "710115", label: "嘉义"},
                {value: "710116", label: "新竹"},
                {value: "710117", label: "花莲"},
                {value: "710118", label: "宜兰"},
                {value: "710119", label: "高雄"},
                {value: "710120", label: "基隆"}
              ]
            },
            {
              value: "810000", label: "香港特别行政区", children: [
                {value: "810101", label: "中西区"},
                {value: "810102", label: "东区"},
                {value: "810103", label: "九龙城区"},
                {value: "810104", label: "观塘区"},
                {value: "810105", label: "深水埗区"},
                {value: "810106", label: "湾仔区"},
                {value: "810107", label: "黄大仙区"},
                {value: "810108", label: "油尖旺区"},
                {value: "810109", label: "离岛区"},
                {value: "810110", label: "葵青区"},
                {value: "810111", label: "北区"},
                {value: "810112", label: "西贡区"},
                {value: "810113", label: "沙田区"},
                {value: "810114", label: "屯门区"},
                {value: "810115", label: "大埔区"},
                {value: "810116", label: "荃湾区"},
                {value: "810117", label: "元朗区"},
                {value: "810118", label: "香港"},
                {value: "810119", label: "九龙"},
                {value: "810120", label: "新界"}
              ]
            },
            {
              value: "820000", label: "澳门特别行政区", children: [
                {value: "820101", label: "离岛"},
                {value: "820102", label: "澳门半岛"},
                {value: "820103", label: "凼仔"},
                {value: "820104", label: "路凼城"},
                {value: "820105", label: "路环"}
              ]
            }
          ]
        ,
        tagOptions: [],
        materialOptions: [],
        fileList: [],
        rules: {
        },
        temp: {
          hoursList: [],
          cityList: [],
          networkList: [],
          tagList: []
        },
        admType: "",
        uploadApi: process.env.BASE_API + "/dsp/upload",
      }
    },
    created() {
      this.fetchListTag()
      this.fetchListMaterial()
      this.getStrategy()
    },
    methods: {
      handleSelectAdConfirm(row) {
        this.temp.pmediaid = row.pmediaid
        this.temp.adplacementid = row.adplacementid
        this.temp.adplacementname = row.adplacementname
        this.dialogSelectVisible = false;
      },
      handleSelectAd() {
        this.dialogSelectVisible = true;
        this.getAdList()
      },
      handleFilter() {
        this.adListQuery.page = 1
        this.getAdList()
      },
      getAdList() {
        this.adListLoading = true
        fetchListAdplacement(this.adListQuery).then(response => {
          this.adList = response.data.list
          this.adTotal = response.data.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.adListLoading = false
          }, 0.2 * 1000)
        })
      },
      fetchListMaterial() {
        let query = {
          limit: 2000
        }
        fetchListMaterial(query).then(response => {
          response.data.list.forEach(item => {
            this.materialOptions.push({
              value: item.id,
              label: item.name
            })
          })
          // console.log(this.materialOptions)
        })
      },
      fetchListTag() {
        let query = {
          limit: 1000
        }
        fetchListTag(query).then(response => {
            response.data.list.forEach(item => {
              this.tagOptions.push({
                value: item.id + "",
                label: item.name
              })
            })
        })
      },
      getStrategy() {
        if (this.$route.query.id === undefined) {
          // this.temp.hoursList = []
          // this.temp.cityList = []
          // this.temp.networkList = []
          // this.temp.tagList = []
        } else {
          let query = {
            "id": this.$route.query.id
          }
          getStrategy(query).then(response => {
            this.temp = response.data
            console.log(this.temp)
          })
        }
      },
      handleRemove() {
        this.fileList = []
        this.temp.adm.materialUrl = ""
        this.temp.adm.dspApiMaterialInnerReqDTO.url = ""
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed() {
        this.$message.warning(`当前限制选择 1 个文件`);
      },
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleUploadSucc(res, file) {
        if (res.code === '200') {
          this.fileList = [
            {
              name: res.fileName,
              url: res.fileUrl
            }
          ]
          this.temp.adm.materialUrl = res.fileUrl;
          this.temp.adm.dspApiMaterialInnerReqDTO.url = res.fileUrl;
        } else {
          return this.$confirm(`上传失败`);
        }
      },
      onSubmit() {
         console.log(this.temp)
         saveStrategy(this.temp).then(response => {
           this.$message.success(`${response.data}`)
           this.$router.push({path: '/strategy/index'})
         })
      },
      filterObj(obj) {
        for (var key in obj) {
          if (obj[key] !== '' && obj[key] !== -1)
            return false;
        }
        return true;
      }
    }
  }
</script>

<style type="text/css">
  .line_01{
    padding: 0 20px 0;
    margin: 20px 0;
    line-height: 1px;
    border-left: 200px solid #ddd;
    border-right: 200px solid #ddd;
    text-align: center;
  }
</style>
