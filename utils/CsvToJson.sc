import scala.io.Source
import $ivy.`org.json4s:json4s-native_2.11:3.5.0`
import org.json4s._
import org.json4s.native.JsonMethods._
import org.json4s.JsonDSL._

// Information layer
case class InformationLayer(name: String, numClass: Int, values: List[Int]) {
  private val json =
    ("name" -> this.name) ~
      ("numClass" -> this.numClass) ~
      ("values" -> this.values)

  def toJson: String = pretty(render(json))
}


val src = Source.fromFile("platynereis_dumerilii_32203/information_layers.csv")
val linesIterator = src.getLines()
lazy val clusterNames = linesIterator.next().split(",").toList
lazy val clusterValues = linesIterator.map(_.split(",")).toList


def linesToInformationLayerStream(clusterNames: List[String],
                                  clusterValues: List[Array[String]]): Stream[InformationLayer] = {
  val n = clusterNames.length

  def _linesToInformationLayerStream(clusterNames: List[String],
                                     clusterValues: List[Array[String]], i: Int): Stream[InformationLayer] = {
    clusterNames match {
      case Nil => Stream.empty
      case head :: tail =>
        InformationLayer(clusterNames.head, n, clusterValues.map(_(i).toInt)) #::
          _linesToInformationLayerStream(tail, clusterValues, i + 1)
    }
  }

  _linesToInformationLayerStream(clusterNames, clusterValues, 0)
}


lazy val informationLayers = linesToInformationLayerStream(clusterNames, clusterValues)



val oneBigFile = false
if (oneBigFile) {
  val filePath = "clusters.json"

  scala.tools.nsc.io.File(filePath).appendAll("{ \"information\": [\n")

  informationLayers.init.map(_.toJson).foreach(jsonStr => scala.tools.nsc.io.File(filePath).appendAll(jsonStr + ",\n"))
  scala.tools.nsc.io.File(filePath).appendAll(informationLayers.last.toJson)

  scala.tools.nsc.io.File(filePath).appendAll("\n]}")
} else {
  informationLayers.foreach(il => scala.tools.nsc.io.File(s"${il.name}.json").appendAll(il.toJson))
}

src.close()

