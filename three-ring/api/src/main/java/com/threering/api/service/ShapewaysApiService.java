package com.threering.api.service;

import com.threering.api.dom.ModelOverview;
import com.threering.api.dom.ModelsResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ShapewaysApiService {
    private static final Logger logger = LoggerFactory.getLogger(ShapewaysApiService.class);

    @Autowired
    private OAuth2RestTemplate shapewaysRestTemplate;

    @Value("${shapeways.api-uri}" )
    private String baseUri;

    static private final String API_STATUS = "/api/v1/";
    static private final String API_CART = "/orders/cart/v1 /";
    static private final String API_MATERIALS = "/materials/v1/";
    static private final String API_MATERIAL = "/materials/%s/v1/";
    static private final String API_MODELS = "/models/v1/";
    static private final String API_MODEL = "/models/%s/v1/";
    static private final String API_MODEL_INFO = "/models/%s/info/v1/";
    static private final String API_MODEL_FILES = "/models/%s/files/v1/";
    static private final String API_MODEL_FILE_VERSION = "/models/%s/files/%s/v1/";
    static private final String API_MODEL_PHOTO = "/models/%s/photo/v1/";
    static private final String API_PRINTERS = "/printers/v1/";
    static private final String API_PRINTER = "/printers/%s/v1/";
    static private final String API_PRICE = "/price/v1/";
    static private final String API_CATEGORIES = "/categories/v1/";
    static private final String API_CATEGORY = "/categories/%s/v1/";
    static private final String API_ORDERS = "/orders/v1/";
    static private final String API_ORDER = "/orders/%s/v1/";
    static private final String API_ORDER_REPRINT = "/orders/%s/reprint/v1/";
    static private final String API_SHAPEJS = "/shapejs/v1";

    private String apiPathOf(String api) {
        return baseUri + api;
    }
    public String status() {
        return shapewaysRestTemplate.getForObject(apiPathOf(API_STATUS), String.class);
    }

    @Cacheable("materials")
    public String materials() {
        logger.debug("Get materials");
        return shapewaysRestTemplate.getForObject(apiPathOf(API_MATERIALS), String.class);
    }

    public String instantPricing(
            double volume,
            double area,
            double xBoundMin,
            double xBoundMax,
            double yBoundMin,
            double yBoundMax,
            double zBoundMin,
            double zBoundMax
            ) {
        Map<String, Object> data = new HashMap<>();
        data.put("volume", volume);
        data.put("area", area);
        data.put("xBoundMin", xBoundMin);
        data.put("xBoundMax", xBoundMax);
        data.put("yBoundMin", yBoundMin);
        data.put("yBoundMax", yBoundMax);
        data.put("zBoundMin", zBoundMin);
        data.put("zBoundMax", zBoundMax);
        return shapewaysRestTemplate.postForObject( apiPathOf(API_PRICE),data , String.class);
    }

    @Cacheable("models")
    public String getModel(Long modelId) {
        String url = String.format(apiPathOf(API_MODEL), modelId);
        return shapewaysRestTemplate.getForObject(url, String.class);
    }

    public List<ModelOverview> getAllModels() {
        ModelsResponse modelsResponse = shapewaysRestTemplate.getForObject(apiPathOf(API_MODELS), ModelsResponse.class);
        if (modelsResponse.getResult().equals("success")) {
            List<Long> modelIds = modelsResponse.getModels().stream().map(ModelOverview::getModelId).collect(Collectors.toList());
        }
        return null;
    }

    public String uploadModel(String filename, String base64Content) {
        Map<String, Object> data = new HashMap<>();
        data.put("fileName", filename);
        data.put("file", base64Content);
        data.put("hasRightsToModel", 1);
        data.put("acceptTermsAndConditions", 1);
        return shapewaysRestTemplate.postForObject( apiPathOf(API_MODELS),data , String.class);
    }

    public String checkout(Long model, Long material) {
        Map<String, Object> data = new HashMap<>();
        data.put("modelId", model);
        data.put("materialId", material);
        data.put("quantity", 1);
        return shapewaysRestTemplate.postForObject( apiPathOf(API_CART), data, String.class);
    }
}
