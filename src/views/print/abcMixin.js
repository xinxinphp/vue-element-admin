// abcMixin 中abc为了文件的排序
import { getLodop } from '@/vendor/LodopFuncs'
export default {
  data() {
    return {
      // 这里不要写数据,为了避免覆盖共有mixin,若能确定不会发生覆盖,可以任意写
      done: null
    }
  },
  created() {
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    /* 打印相关 */
    initPrint() {
      return getLodop()
    },
    startPrint(data) {
      const checkItems = data.data
      const form = data.form
      const LODOP = getLodop()
      checkItems.forEach((item, i) => {
        LODOP.PRINT_INIT('Item标签打印')
        LODOP.SET_PRINT_STYLE('FontSize', 9)
        LODOP.SET_PRINT_STYLEA(2, 'FontName', '隶书')
        // 设置纸张高度 SET_PRINT_PAGESIZE(intOrient, PageWidth,PageHeight,strPageName)
        LODOP.SET_PRINT_PAGESIZE(2, '100mm', '150mm', '')

        // ADD_PRINT_LINE(Top1,Left1, Top2, Left2,intLineStyle, intLineWidth)
        LODOP.ADD_PRINT_LINE(0, 0, 0, '150mm', 0, 2)
        LODOP.ADD_PRINT_LINE(0, '150mm', '100mm', '150mm', 0, 2)
        LODOP.ADD_PRINT_LINE('99mm', 0, '99mm', '150mm', 0, 2)
        LODOP.ADD_PRINT_LINE(0, 4, '150mm', 4, 0, 2)
        // 以上四条边线 上左下右
        LODOP.ADD_PRINT_LINE('18mm', 0, '18mm', '150mm', 0, 2)
        LODOP.ADD_PRINT_LINE('40mm', 0, '40mm', '150mm', 0, 2)
        LODOP.ADD_PRINT_LINE('50mm', 0, '50mm', '150mm', 0, 2)
        LODOP.ADD_PRINT_LINE('60mm', 0, '60mm', '150mm', 0, 2)
        LODOP.ADD_PRINT_LINE('70mm', 0, '70mm', '150mm', 0, 2)
        LODOP.ADD_PRINT_LINE('80mm', 0, '80mm', '150mm', 0, 2)
        // 以上六条横线 从上到下

        LODOP.ADD_PRINT_LINE('40mm', '80mm', '50mm', '80mm', 0, 2)

        LODOP.ADD_PRINT_LINE('50mm', '50mm', '60mm', '50mm', 0, 2)
        LODOP.ADD_PRINT_LINE('50mm', '102mm', '60mm', '102mm', 0, 2)

        LODOP.ADD_PRINT_LINE('60mm', '80mm', '150mm', '80mm', 0, 2)

        LODOP.ADD_PRINT_LINE('80mm', '102mm', '150mm', '102mm', 0, 2)

        // 以上是小断格线

        // ADD_PRINT_HTM(Top,Left,Width,Height,strHtmlContent)
        LODOP.ADD_PRINT_HTM('20mm', '5mm', '140mm', '25mm', `<h2 style=" line-height: 9mm">${form.materialName}</h2>`)

        LODOP.ADD_PRINT_HTM('40mm', '5mm', '70mm', '20mm', `<p style="text-align: center; line-height: 9mm; letter-spacing: 1px;  ">${form.internalShortCode}</p>`)
        LODOP.ADD_PRINT_HTM('40mm', '80mm', '70mm', '20mm', `<p style="text-align: center; line-height: 9mm; letter-spacing: 1px;  ">${form.materialCode}</p>`)

        LODOP.ADD_PRINT_HTM('50mm', '5mm', '45mm', '20mm', `<p style="text-align: left; line-height: 9mm; letter-spacing: 1px;  "><span style="font-weight: 600">品牌:</span>${form.materialBrand}</p>`)
        LODOP.ADD_PRINT_HTM('50mm', '51mm', '54mm', '20mm', `<p style="text-align: left; line-height: 9mm; letter-spacing: 1px;  "><span style="font-weight: 600">类别:</span>${form.materialCategory}</p>`)
        LODOP.ADD_PRINT_HTM('50mm', '103mm', '50mm', '20mm', `<p style="text-align: left; line-height: 9mm; letter-spacing: 1px;  "><span style="font-weight: 600">型号:</span>${form.materialBrand}</p>`)

        LODOP.ADD_PRINT_HTM('60mm', '5mm', '70mm', '20mm', `<p style="text-align: left; line-height: 9mm; letter-spacing: 1px;  "><span style="font-weight: 600">版本号:</span>${form.version}</p>`)
        LODOP.ADD_PRINT_HTM('60mm', '81mm', '70mm', '20mm', `<p style="text-align: left; line-height: 9mm; letter-spacing: 1px;  "><span style="font-weight: 600">数量:</span>${item.displayQuantity}</p>`)

        LODOP.ADD_PRINT_HTM('70mm', '5mm', '70mm', '20mm', `<p style="text-align: left; line-height: 9mm; letter-spacing: 1px;  "><span style="font-weight: 600">生产日期:</span>${form.productionDate ? form.productionDate : ''}</p>`)
        LODOP.ADD_PRINT_HTM('70mm', '81mm', '70mm', '20mm', `<p style="text-align: left; line-height: 9mm; letter-spacing: 1px;  "><span style="font-weight: 600">到厂时间:</span>${form.factoryDate}</p>`)

        LODOP.ADD_PRINT_BARCODE('82mm', '5mm', '80mm', '16mm', '128C', `${item.tagNo}`)
        // LODOP.ADD_PRINT_BARCODE('82mm', '5mm', '80mm', '16mm', '128C', `00049230319060400001`)
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 6)

        LODOP.ADD_PRINT_HTM('81mm', '81mm', '22mm', '40mm', `<p style="text-align: left; line-height: 13mm; letter-spacing: 1px;  "><span style="font-weight: 600"> ${item.printSeq}/ ${item.ordinal}/ ${item.totalPrintNum}</span></p>`)
        LODOP.ADD_PRINT_HTM('81mm', '103mm', '50mm', '40mm', `<p style="text-align: left; line-height: 13mm; ">${form.vendorName.slice(0, 11)}</p>`)

        // LODOP.ADD_PRINT_TEXT(48, 73, 160, 20, item.name)
        // LODOP.ADD_PRINT_BARCODE(30, 245, 130, 130, 'Code39', item.tagNo)
        LODOP.SET_PRINT_STYLEA(0, 'GroundColor', '#FFFFFF')
        LODOP.SET_PRINT_STYLEA(0, 'DataCharset', 'GBK')
        // LODOP.ADD_PRINT_IMAGE(172, 245, 95, 72, "<img src='content/images/ic_wilmar.png'/>")
        LODOP.SET_PRINT_STYLEA(1, 'Stretch', 2)
        LODOP.SET_PRINTER_INDEX('Rongta RP4xx Series')
        LODOP.PREVIEW() // 打印预览
        // LODOP.PRINT() // 选择打印机打印
      })
    }
  }
}
